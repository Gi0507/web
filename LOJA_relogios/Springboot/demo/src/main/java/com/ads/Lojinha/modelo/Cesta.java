package com.ads.Lojinha.modelo;

import  com.ads.Lojinha.modelo.Cesta;
import  com.ads.Lojinha.modelo.Cliente;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @OneToMany(
        mappedBy = "cesta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ItemCesta> itens = new ArrayList<>();
    private double ValorTotal;

}