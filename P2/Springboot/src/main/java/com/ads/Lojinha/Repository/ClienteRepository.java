package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByEmailIgnoreCase(String email);
    Optional<Cliente> findByCpf(String cpf);
}
