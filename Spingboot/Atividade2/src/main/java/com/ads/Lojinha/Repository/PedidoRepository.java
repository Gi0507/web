package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.cliente;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ads.Lojinha.modelo.Pedido;


@Repository
public abstract class PedidoRepository implements JpaRepository<Pedido, Long> {

    public Pedido save(Pedido pedido) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}