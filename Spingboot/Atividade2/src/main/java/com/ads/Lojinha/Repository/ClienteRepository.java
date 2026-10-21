package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.cliente;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public abstract class ClienteRepository implements JpaRepository<cliente, Long> {

}