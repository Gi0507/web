package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.cliente;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ads.Lojinha.modelo.Pedido;


@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
}