package com.ads.Lojinha.controler;

import com.ads.Lojinha.modelo.Cesta;
import com.ads.Lojinha.service.CestaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cestas")
@CrossOrigin(origins = "http://localhost:4200")
public class CestaController {

    private final CestaService cestaService;

    public CestaController(CestaService cestaService) {
        this.cestaService = cestaService;
    }

    @PostMapping("/{cpf}")
    public ResponseEntity<Cesta> criarOuObter(@PathVariable String cpf) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cestaService.obterOuCriar(cpf));
    }

    @GetMapping("/cliente/{cpf}")
    public ResponseEntity<Cesta> buscarPorCliente(@PathVariable String cpf) {
        return ResponseEntity.ok(cestaService.buscarPorCliente(cpf));
    }

    @PostMapping("/{cpf}/itens")
    public ResponseEntity<Cesta> adicionarProduto(@PathVariable String cpf,
                                                   @RequestParam Integer produtoId,
                                                   @RequestParam Integer quantidade) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cestaService.adicionarProduto(cpf, produtoId, quantidade));
    }

    @PutMapping("/{cpf}/itens/{produtoId}")
    public ResponseEntity<Cesta> definirQuantidade(@PathVariable String cpf,
                                                    @PathVariable Integer produtoId,
                                                    @RequestParam Integer quantidade) {
        return ResponseEntity.ok(cestaService.definirQuantidade(cpf, produtoId, quantidade));
    }

    @DeleteMapping("/{cpf}/itens/{produtoId}")
    public ResponseEntity<Cesta> removerProduto(@PathVariable String cpf,
                                                 @PathVariable Integer produtoId) {
        return ResponseEntity.ok(cestaService.removerProdutoPorCodigo(cpf, produtoId));
    }

    @DeleteMapping("/{cpf}/itens")
    public ResponseEntity<Cesta> limpar(@PathVariable String cpf) {
        return ResponseEntity.ok(cestaService.limparCesta(cpf));
    }
}
