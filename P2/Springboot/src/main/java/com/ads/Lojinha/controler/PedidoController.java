package com.ads.Lojinha.controler;

import com.ads.Lojinha.Repository.PedidoRepository;
import com.ads.Lojinha.modelo.Pedido;
import com.ads.Lojinha.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final PedidoService pedidoService;

    public PedidoController(PedidoRepository pedidoRepository, PedidoService pedidoService) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{cpf}")
    public List<Pedido> listarPorCliente(@PathVariable String cpf) {
        return pedidoService.listarPorCliente(cpf);
    }

    @PostMapping("/finalizar/{cpf}")
    public ResponseEntity<Pedido> finalizar(@PathVariable String cpf) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.finalizar(cpf));
    }

    @PostMapping("/{id}/reenviar-email")
    public ResponseEntity<Pedido> reenviarEmail(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.reenviarEmailConfirmacao(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!pedidoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pedidoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
