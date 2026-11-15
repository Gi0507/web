
package com.ads.Lojinha.controler;

import com.ads.Lojinha.modelo.Cesta;
import com.ads.Lojinha.modelo.ItemCesta;
import com.ads.Lojinha.modelo.Produto;

import com.ads.Lojinha.Repository.CestaRepository;
import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.Repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cestas")
public class CestaController {

    @Autowired
    private CestaRepository cestaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    // POST - Criar cesta para um cliente
    @PostMapping("/{cpf}")
    public ResponseEntity<?> criarCesta(@PathVariable String cpf) {

        // Verifica se o cliente já possui uma cesta
        if (cestaRepository.existsByClienteCpf(cpf)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Este cliente já possui uma cesta.");
        }

        // Busca o cliente pelo CPF
        return clienteRepository.findByCpf((cpf)
                .matches(clienteEncontrado -> {

                    Cesta novaCesta = new Cesta();
                    novaCesta.setCliente(clienteEncontrado);

                    Cesta cestaSalva = cestaRepository.save(novaCesta);

                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(cestaSalva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - Consultar cesta pelo CPF do cliente
    @GetMapping("/cliente/{cpf}")
    public ResponseEntity<Cesta> buscarPorCliente(
            @PathVariable String cpf) {

        return cestaRepository.findByClienteCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Adicionar produto na cesta
    @PostMapping("/{cpf}/itens")
    public ResponseEntity<?> adicionarProduto(
            @PathVariable String cpf,
            @RequestParam Long produtoId,
            @RequestParam Integer quantidade) {

        if (quantidade == null || quantidade <= 0) {
            return ResponseEntity.badRequest()
                    .body("A quantidade deve ser maior que zero.");
        }

        // Busca a cesta do cliente
        var cestaOptional = cestaRepository.findByClienteCpf(cpf);

        if (cestaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cesta não encontrada.");
        }

        // Busca o produto
        var produtoOptional = produtoRepository.findById(produtoId);

        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Produto não encontrado.");
        }

        Cesta cesta = cestaOptional.get();
        Produto produto = produtoOptional.get();

        // Verifica se o produto já está na cesta
        for (ItemCesta item : cesta.getItens()) {
            if (item.getProduto().getCodigo() == produto.getCodigo()) {

                item.setQuantidade(item.getQuantidade() + quantidade);

                return ResponseEntity.ok(
                        cestaRepository.save(cesta)
                );
            }
        }

        // Adiciona um novo item
        ItemCesta novoItem = new ItemCesta();
        novoItem.setCesta(cesta);
        novoItem.setProduto(produto);
        novoItem.setQuantidade(quantidade);

        cesta.getItens().add(novoItem);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cestaRepository.save(cesta));
    }

    // DELETE - Remover produto da cesta
    @DeleteMapping("/{cpf}/itens/{itemId}")
    public ResponseEntity<?> removerProduto(
            @PathVariable String cpf,
            @PathVariable Long itemId) {

        var cestaOptional = cestaRepository.findByClienteCpf(cpf);

        if (cestaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cesta cesta = cestaOptional.get();

        boolean removido = cesta.getItens()
                .removeIf(item -> item.getId().equals(itemId));

        if (!removido) {
            return ResponseEntity.notFound().build();
        }

        cestaRepository.save(cesta);

        return ResponseEntity.noContent().build();
    }

    // DELETE - Excluir cesta do cliente
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> excluirCesta(
            @PathVariable String cpf) {

        return cestaRepository.findByClienteCpf(cpf)
                .map(cesta -> {
                    cestaRepository.delete(cesta);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
