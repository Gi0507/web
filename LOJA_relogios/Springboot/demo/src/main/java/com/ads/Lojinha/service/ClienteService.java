package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.ClienteRepository;
import com.ads.Lojinha.dto.loginDTO;
import com.ads.Lojinha.modelo.cliente;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ClienteService {

    private final ClienteRepository repository;
    private final PasswordEncoder encoder;

    public ClienteService(
            ClienteRepository repository,
            PasswordEncoder encoder) {

        this.repository = repository;
        this.encoder = encoder;
    }

    public boolean login(loginDTO dados) {

        cliente usuario = repository
                .findByEmail(dados.email())
                .orElse(null);

        if (usuario == null) {
            return false;
        }

        return encoder.matches(
            dados.senha(),
            usuario.getSenha()
        );
    }
}