package com.ads.Lojinha.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "itens_cesta")
public class ItemCesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cesta_id", nullable = false)
    @JsonIgnore
    private Cesta cesta;

    @ManyToOne
    @JoinColumn(name = "produto_codigo", nullable = false)
    private Produto produto;

    private Integer quantidade;
}
