package com.ads.Lojinha.modelo;

import java.lang.reflect.Array;

import lombok.AllArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@AllArgsConstructor 
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cliente;
    private Produto[] produto;
    private Double total;
    
    public String getcliente() {
        return cliente;
    }
    public Produto[] getproduto() {
        return produto;
    }
    public Double gettotal() {
        return total;
    }
    public void setCliente(String cliente) {
        this.cliente = cliente;
    }
    public void setProduto(Produto[] produto) {
        this.produto = produto;
    }
    public void setTotal(Double total) {
        this.total = total;
    }

}
