package com.ads.Lojinha.Repository;

import com.ads.Lojinha.modelo.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public abstract class ProdutoRepository implements JpaRepository<Produto, Long> {
    
}
