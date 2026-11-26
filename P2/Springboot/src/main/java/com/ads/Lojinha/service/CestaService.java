package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.CestaRepository;
import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.Repository.ProdutoRepository;
import com.ads.Lojinha.modelo.Cesta;
import com.ads.Lojinha.modelo.Cliente;
import com.ads.Lojinha.modelo.ItemCesta;
import com.ads.Lojinha.modelo.Produto;
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
    public Cesta obterOuCriar(String cpf) {
        return cestaRepository.findByClienteCpf(cpf).orElseGet(() -> {
            Cliente cliente = clienteRepository.findByCpf(cpf)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

            Cesta cesta = new Cesta();
            cesta.setCliente(cliente);
            cesta.setItens(new ArrayList<>());
            cesta.setValorTotal(0);
            return cestaRepository.save(cesta);
        });
    }

    public Cesta buscarPorCliente(String cpf) {
        return obterOuCriar(cpf);
    }

    @Transactional
    public Cesta adicionarProduto(String cpf, Integer produtoId, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade deve ser maior que zero.");
        }

        Cesta cesta = obterOuCriar(cpf);
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));

        for (ItemCesta item : cesta.getItens()) {
            if (Objects.equals(item.getProduto().getId(), produto.getId())) {
                item.setQuantidade(item.getQuantidade() + quantidade);
                atualizarValorTotal(cesta);
                return cestaRepository.save(cesta);
            }
        }

        ItemCesta novoItem = new ItemCesta();
        novoItem.setCesta(cesta);
        novoItem.setProduto(produto);
        novoItem.setQuantidade(quantidade);
        cesta.getItens().add(novoItem);

        atualizarValorTotal(cesta);
        return cestaRepository.save(cesta);
    }

    @Transactional
    public Cesta definirQuantidade(String cpf, Integer produtoId, Integer quantidade) {
        Cesta cesta = obterOuCriar(cpf);

        ItemCesta item = cesta.getItens().stream()
                .filter(i -> Objects.equals(i.getProduto().getId(), produtoId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado na cesta."));

        if (quantidade == null || quantidade <= 0) {
            cesta.getItens().remove(item);
        } else {
            item.setQuantidade(quantidade);
        }

        atualizarValorTotal(cesta);
        return cestaRepository.save(cesta);
    }

    @Transactional
    public Cesta removerProdutoPorCodigo(String cpf, Integer produtoId) {
        Cesta cesta = obterOuCriar(cpf);
        boolean removido = cesta.getItens()
                .removeIf(item -> Objects.equals(item.getProduto().getId(), produtoId));

        if (!removido) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado na cesta.");
        }

        atualizarValorTotal(cesta);
        return cestaRepository.save(cesta);
    }

    @Transactional
    public Cesta limparCesta(String cpf) {
        Cesta cesta = obterOuCriar(cpf);
        cesta.getItens().clear();
        cesta.setValorTotal(0);
        return cestaRepository.save(cesta);
    }

    private void atualizarValorTotal(Cesta cesta) {
        double total = cesta.getItens().stream().mapToDouble(item -> {
            Produto produto = item.getProduto();
            double preco = produto.getValorPromo() > 0 ? produto.getValorPromo() : produto.getValor();
            return preco * item.getQuantidade();
        }).sum();
        cesta.setValorTotal(total);
    }
}
