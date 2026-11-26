package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.dto.loginDTO;
import com.ads.Lojinha.modelo.Cliente;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ClienteService {

    private static final long TEMPO_CODIGO_SEGUNDOS = 10 * 60;

    private final ClienteRepository repository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, CodigoRecuperacao> codigosRecuperacao = new ConcurrentHashMap<>();

    public ClienteService(ClienteRepository repository, PasswordEncoder encoder, EmailService emailService) {
        this.repository = repository;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    public Cliente cadastrar(Cliente cliente) {
        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail é obrigatório.");
        }
        if (cliente.getSenha() == null || cliente.getSenha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha é obrigatória.");
        }
        if (repository.findByEmailIgnoreCase(cliente.getEmail().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");
        }

        cliente.setEmail(cliente.getEmail().trim());
        cliente.setSenha(encoder.encode(cliente.getSenha()));
        return repository.save(cliente);
    }

    public Cliente autenticar(loginDTO dados) {
        if (dados == null || dados.email() == null || dados.senha() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos!");
        }

        Cliente usuario = repository.findByEmailIgnoreCase(dados.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos!"));

        String senhaSalva = usuario.getSenha();
        boolean senhaCorreta;

        if (senhaSalva != null && senhaSalva.startsWith("$2")) {
            senhaCorreta = encoder.matches(dados.senha(), senhaSalva);
        } else {
            senhaCorreta = senhaSalva != null && senhaSalva.equals(dados.senha());
            if (senhaCorreta) {
                usuario.setSenha(encoder.encode(dados.senha()));
                repository.save(usuario);
            }
        }

        if (!senhaCorreta) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha incorretos!");
        }
        return usuario;
    }

    public boolean login(loginDTO dados) {
        try {
            autenticar(dados);
            return true;
        } catch (ResponseStatusException ex) {
            return false;
        }
    }

    public ResultadoRecuperacao gerarCodigoRecuperacao(String email) {
        String emailNormalizado = normalizarEmail(email);

        Cliente cliente = repository.findByEmailIgnoreCase(emailNormalizado)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "E-mail não encontrado."));

        String codigo = String.format("%06d", secureRandom.nextInt(1_000_000));
        Instant expiraEm = Instant.now().plusSeconds(TEMPO_CODIGO_SEGUNDOS);
        codigosRecuperacao.put(emailNormalizado, new CodigoRecuperacao(codigo, expiraEm));

        if (emailService.isConfigurado()) {
            String nomeCliente = (cliente.getNome() != null && !cliente.getNome().isBlank())
                    ? cliente.getNome()
                    : "Cliente";

            String corpoHtml = """
                    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #2c2c2c; margin-top: 0;">Recuperação de Senha - TimeSTOR</h2>
                        <p>Olá, <strong>%s</strong>!</p>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta. Utilize o código abaixo (válido por 10 minutos):</p>
                        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f4f4f4; color: #1b5e20; padding: 14px 20px; width: fit-content; border-radius: 6px; margin: 16px 0;">
                            %s
                        </div>
                        <p style="color: #555; font-size: 0.9rem;">Se você não solicitou esta alteração, apenas ignore este e-mail.</p>
                    </div>
                    """.formatted(nomeCliente, codigo);

            emailService.enviarEmail(
                    cliente.getEmail(),
                    "Código de Recuperação de Senha - TimeSTOR",
                    corpoHtml
            );
            return new ResultadoRecuperacao(null, true);
        }

        return new ResultadoRecuperacao(codigo, false);
    }

    public void redefinirSenha(String email, String codigo, String novaSenha) {
        String emailNormalizado = normalizarEmail(email);

        if (codigo == null || codigo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o código de recuperação.");
        }
        if (novaSenha == null || novaSenha.trim().length() < 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ter pelo menos 4 caracteres.");
        }

        CodigoRecuperacao recuperacao = codigosRecuperacao.get(emailNormalizado);
        if (recuperacao == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solicite um novo código de recuperação.");
        }
        if (Instant.now().isAfter(recuperacao.expiraEm())) {
            codigosRecuperacao.remove(emailNormalizado);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O código expirou. Solicite um novo código.");
        }
        if (!recuperacao.codigo().equals(codigo.trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código de recuperação inválido.");
        }

        Cliente cliente = repository.findByEmailIgnoreCase(emailNormalizado)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "E-mail não encontrado."));

        cliente.setSenha(encoder.encode(novaSenha.trim()));
        repository.save(cliente);
        codigosRecuperacao.remove(emailNormalizado);
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o e-mail.");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private record CodigoRecuperacao(String codigo, Instant expiraEm) {
    }

    public record ResultadoRecuperacao(String codigo, boolean enviadoPorEmail) {
    }
}
