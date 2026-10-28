package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.cliente;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


@Repository
public interface ClienteRepository extends JpaRepository<cliente, Long> {
   Optional<cliente> findByEmail(String email);
}