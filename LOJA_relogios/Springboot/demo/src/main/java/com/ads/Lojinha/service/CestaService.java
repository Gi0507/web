package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.CestaRepository;
import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.Repository.ProdutoRepository;
import com.ads.Lojinha.modelo.Cesta;
import com.ads.Lojinha.modelo.ItemCesta;
import com.ads.Lojinha.modelo.Produto;
import com.ads.Lojinha.modelo.Cliente;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Objects;

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

    @Transactional
    public Cesta criarCesta(String cpf) {
        if (cestaRepository.existsByClienteCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este cliente já possui uma cesta.");
        }

        Cliente clienteEncontrado = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado.");

        Cesta novaCesta = new Cesta();
        novaCesta.setCliente(clienteEncontrado);
        if (novaCesta.getItens() == null) {
            novaCesta.setItens(new ArrayList<>());
        }

        return cestaRepository.save(novaCesta);
    }

    public Cesta buscarPorCliente(String cpf) {
        return cestaRepository.findByClienteCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cesta não encontrada."));
    }

    @Transactional
    public Cesta adicionarProduto(String cpf, Long produtoId, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade deve ser maior que zero.");
        }

        Cesta cesta = buscarPorCliente(cpf);

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));

        for (ItemCesta item : cesta.getItens()) {
            if (Objects.equals(item.getProduto().getId(), produto.getId())) {
                item.setQuantidade(item.getQuantidade() + quantidade);
                return cestaRepository.save(cesta);
            }
        }

        ItemCesta novoItem = new ItemCesta();
        novoItem.setCesta(cesta);
        novoItem.setProduto(produto);
        novoItem.setQuantidade(quantidade);

        cesta.getItens().add(novoItem);
        return cestaRepository.save(cesta);
    }

    @Transactional
    public void removerProduto(String cpf, Long itemId) {
        Cesta cesta = buscarPorCliente(cpf);

        boolean removido = cesta.getItens()
                .removeIf(item -> Objects.equals(item.getId(), itemId));

        if (!removido) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado na cesta.");
        }

        cestaRepository.save(cesta);
    }

    @Transactional
    public void excluirCesta(String cpf) {
        Cesta cesta = buscarPorCliente(cpf);
        cestaRepository.delete(cesta);
    }
}