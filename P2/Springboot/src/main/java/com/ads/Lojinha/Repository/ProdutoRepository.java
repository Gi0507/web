package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    List<Produto> findByNomeContainingIgnoreCaseOrDescritivoContainingIgnoreCase(String nome, String descritivo);
}
