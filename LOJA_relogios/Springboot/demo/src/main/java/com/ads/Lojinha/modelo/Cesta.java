package com.ads.Lojinha.modelo;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

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
    private cliente cliente;

    @OneToMany(
        mappedBy = "cesta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ItemCesta> itens = new ArrayList<>();

    public Cesta() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public cliente getCliente() {
        return cliente;
    }

    public void setCliente(Object cliente) {
        this.cliente = cliente;
    }

    public List<ItemCesta> getItens() {
        return itens;
    }

    public void setItens(List<ItemCesta> itens) {
        this.itens = itens;
    }

}