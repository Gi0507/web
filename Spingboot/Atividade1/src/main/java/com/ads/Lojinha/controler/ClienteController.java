package com.ads.Lojinha.controler;

import com.ads.Lojinha.modelo.cliente;
import com.ads.Lojinha.Repository.ClienteRepository;
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
    public List<cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    // GET - Buscar cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<cliente> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(cliente))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Cadastrar novo cliente
    @PostMapping
    public ResponseEntity<cliente> criar(@RequestBody cliente cliente) {
        cliente novoCliente = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    // PUT - Atualizar cliente por ID
    @PutMapping("/{id}")
    public ResponseEntity<cliente> atualizar(@PathVariable Long id, @RequestBody cliente clienteAtualizado) {
        return clienteRepository.findById(id)
                .map(clienteExistente -> {
                    clienteExistente.setNome(clienteAtualizado.getNome());
                    clienteExistente.setEmail(clienteAtualizado.getEmail());
                    clienteExistente.setTelefone(clienteAtualizado.getTelefone());
                    cliente clienteSalvo = clienteRepository.save(clienteExistente);
                    return ResponseEntity.ok(clienteSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
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