package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.CestaRepository;
import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.Repository.ProdutoRepository;
import com.ads.Lojinha.modelo.Cesta;
import com.ads.Lojinha.modelo.ItemCesta;
import com.ads.Lojinha.modelo.Produto;
import com.ads.Lojinha.modelo.Cliente;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CestaService {

    private final CestaRepository cestaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public CestaService(CestaRepository cestaRepository,
                        ClienteRepository clienteRepository,
                        ProdutoRepository produtoRepository) {
        this.cestaRepository = cestaRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    // Busca a cesta ativa do cliente ou cria uma nova vazia
    public Cesta buscarOuCriarCesta(Long clienteId) {
        Cliente cli = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return cestaRepository.findByClienteId(clienteId)
                .orElseGet(() -> {
                    Cesta novaCesta = new Cesta();
                    novaCesta.setCliente(cli);
                    novaCesta.setItens(new ArrayList<>());
                    novaCesta.setValorTotal(0.0);
                    return cestaRepository.save(novaCesta);
                });
    }

    // Adiciona um relógio à cesta (se já existir, apenas incrementa a quantidade)
    @Transactional
    public Cesta adicionarItem(Long clienteId, Long produtoId, int quantidade) {
        Cesta cesta = buscarOuCriarCesta(clienteId);
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Optional<ItemCesta> itemExistente = cesta.getItens().stream()
                .filter(item -> item.getProduto().getId().equals(produtoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            ItemCesta item = itemExistente.get();
            item.setQuantidade(item.getQuantidade() + quantidade);
            item.setValorTotal(item.getQuantidade() * produto.getValor());
        } else {
            ItemCesta novoItem = new ItemCesta();
            novoItem.setCesta(cesta);
            novoItem.setProduto(produto);
            novoItem.setQuantidade(quantidade);
            novoItem.setValorTotal(quantidade * produto.getValor());
            cesta.getItens().add(novoItem);
        }

        recalcularTotal(cesta);
        return cestaRepository.save(cesta);
    }

    // Remove um item específico da cesta
    @Transactional
    public Cesta removerItem(Long clienteId, Long produtoId) {
        Cesta cesta = buscarOuCriarCesta(clienteId);
        cesta.getItens().removeIf(item -> item.getProduto().getId().equals(produtoId));
        recalcularTotal(cesta);
        return cestaRepository.save(cesta);
    }

    // Esvazia a cesta (útil após finalizar o pedido)
    @Transactional
    public void limparCesta(Long clienteId) {
        Cesta cesta = buscarOuCriarCesta(clienteId);
        cesta.getItens().clear();
        cesta.setValorTotal(0.0);
        cestaRepository.save(cesta);
    }

    private void recalcularTotal(Cesta cesta) {
        double total = cesta.getItens().stream()
                .mapToDouble(ItemCesta::getValorTotal)
                .sum();
        cesta.setValorTotal(total);
    }
}