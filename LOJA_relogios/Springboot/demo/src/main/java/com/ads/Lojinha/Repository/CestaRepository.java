package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.Cesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CestaRepository extends JpaRepository<Cesta, Long> {

    Optional<Cesta> findByClienteCpf(String cpf);
}