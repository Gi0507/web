package com.ads.Lojinha.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Array;

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

    @ManyToOne
    @JoinColumn(name = "cesta_id")
    private Cesta cesta;

    @ManyToOne
    @JoinColumn(name = "produto_codigo")
    private Produto produto;

    private Integer quantidade;


}