package com.ads.Lojinha.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity 
@Table (name = "produtos")
public class Produto {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int codigo;
    private String nome;
    private String descritivo;
    private double valor;
    private double valorPromo;
    private int quantidade;
    private int destaque;


}