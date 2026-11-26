package com.ads.Lojinha.controler;

import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.dto.RecuperarSenhaDTO;
import com.ads.Lojinha.dto.RedefinirSenhaDTO;
import com.ads.Lojinha.dto.loginDTO;
import com.ads.Lojinha.modelo.Cliente;
import com.ads.Lojinha.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    public ClienteController(ClienteRepository clienteRepository, ClienteService clienteService) {
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.cadastrar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        return clienteRepository.findById(id)
                .map(clienteExistente -> {
                    clienteExistente.setNome(clienteAtualizado.getNome());
                    clienteExistente.setEmail(clienteAtualizado.getEmail());
                    clienteExistente.setTelefone(clienteAtualizado.getTelefone());
                    clienteExistente.setCpf(clienteAtualizado.getCpf());
                    clienteExistente.setEndereco(clienteAtualizado.getEndereco());
                    Cliente clienteSalvo = clienteRepository.save(clienteExistente);
                    return ResponseEntity.ok(clienteSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody loginDTO dados) {
        Cliente cliente = clienteService.autenticar(dados);
        return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "mensagem", "Login realizado!",
                "cliente", cliente
        ));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, Object>> recuperarSenha(@RequestBody RecuperarSenhaDTO dados) {
        ClienteService.ResultadoRecuperacao resultado = clienteService.gerarCodigoRecuperacao(dados.email());

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("sucesso", true);
        resposta.put("enviadoPorEmail", resultado.enviadoPorEmail());

        if (resultado.enviadoPorEmail()) {
            resposta.put("mensagem", "Código de recuperação enviado diretamente para o seu e-mail!");
            resposta.put("modoDemonstracao", false);
        } else {
            resposta.put("mensagem", "Código gerado (configure MAIL_USERNAME e MAIL_PASSWORD no .env para envio real).");
            resposta.put("codigo", resultado.codigo());
            resposta.put("modoDemonstracao", true);
        }

        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, Object>> redefinirSenha(@RequestBody RedefinirSenhaDTO dados) {
        clienteService.redefinirSenha(dados.email(), dados.codigo(), dados.novaSenha());
        return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "mensagem", "Senha alterada com sucesso!"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
