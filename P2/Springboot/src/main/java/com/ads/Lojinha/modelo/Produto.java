package com.ads.Lojinha.modelo;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String descritivo;
    private Double valor = 0.0;
    private Double valorPromo = 0.0;
    private Integer quantidade = 0;
    private Integer destaque = 0;

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescritivo() {
        return descritivo;
    }

    public double getValor() {
        return valor != null ? valor : 0.0;
    }

    public double getValorPromo() {
        return valorPromo != null ? valorPromo : 0.0;
    }

    public int getQuantidade() {
        return quantidade != null ? quantidade : 0;
    }

    public int getDestaque() {
        return destaque != null ? destaque : 0;
    }
}
