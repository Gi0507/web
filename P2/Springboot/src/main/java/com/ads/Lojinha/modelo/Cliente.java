package com.ads.Lojinha.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cpf;
    private String nome;
    private String telefone;
    private String email;
    private String endereco;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    private Date dataNascimento;
}
