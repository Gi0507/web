package com.ads.Lojinha.modelo;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cestas")
public class Cesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cpf_cliente", referencedColumnName = "cpf")
    private Cliente cliente;

    @OneToMany(mappedBy = "cesta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCesta> itens = new ArrayList<>();

    private double valorTotal;
}
