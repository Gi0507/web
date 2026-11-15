package com.ads.Lojinha.controler;

import com.ads.Lojinha.modelo.Cliente;
import com.ads.Lojinha.service.ClienteService;
import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.dto.loginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController{

    @Autowired
    private ClienteRepository clienteRepository;

    // GET - Buscar todos os clientes
    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    // GET - Buscar cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(cliente))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Cadastrar novo cliente
    @PostMapping
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    // PUT - Atualizar cliente por ID
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        return clienteRepository.findById(id)
                .map(clienteExistente -> {
                    clienteExistente.setNome(clienteAtualizado.getNome());
                    clienteExistente.setEmail(clienteAtualizado.getEmail());
                    clienteExistente.setTelefone(clienteAtualizado.getTelefone());
                    Cliente clienteSalvo = clienteRepository.save(clienteExistente);
                    return ResponseEntity.ok(clienteSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
private ClienteService clienteService;

@PostMapping("/login")
public ResponseEntity<String> login(
        @RequestBody loginDTO dados) {

    boolean autenticado = clienteService.login(dados);

    if (autenticado) {
        return ResponseEntity.ok("Login realizado!");
    }

    return ResponseEntity.status(401)
            .body("Email ou senha incorretos!");
}
    // DELETE - Remover cliente por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}