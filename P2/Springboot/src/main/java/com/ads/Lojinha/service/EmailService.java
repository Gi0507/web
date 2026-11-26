package com.ads.Lojinha.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String remetente;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean isConfigurado() {
        return remetente != null
                && !remetente.isBlank()
                && !remetente.equalsIgnoreCase("seu.email@gmail.com");
    }

    public void enviarEmail(String destinatario, String assunto, String conteudoHtml) {
        if (!isConfigurado()) {
            throw new IllegalStateException("Servidor SMTP não configurado. Preencha MAIL_USERNAME e MAIL_PASSWORD.");
        }
        if (destinatario == null || destinatario.isBlank() || !destinatario.contains("@")) {
            throw new IllegalArgumentException("E-mail do destinatário inválido: " + destinatario);
        }

        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            String emailRemetente = remetente.trim();
            try {
                helper.setFrom(emailRemetente, "TimeSTOR - Loja de Relógios");
            } catch (UnsupportedEncodingException e) {
                helper.setFrom(emailRemetente);
            }

            helper.setTo(destinatario.trim());
            helper.setSubject(assunto);
            helper.setText(conteudoHtml, true);

            mailSender.send(mensagem);
        } catch (MailAuthenticationException e) {
            throw new RuntimeException(
                    "Falha na autenticação SMTP do Gmail. Verifique se spring.mail.password (ou MAIL_PASSWORD) é uma Senha de App de 16 caracteres do Google.",
                    e
            );
        } catch (MessagingException | MailException e) {
            throw new RuntimeException("Falha ao enviar e-mail para " + destinatario + ": " + e.getMessage(), e);
        }
    }
}
