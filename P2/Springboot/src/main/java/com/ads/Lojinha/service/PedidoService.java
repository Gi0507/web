package com.ads.Lojinha.service;

import com.ads.Lojinha.Repository.CestaRepository;
import com.ads.Lojinha.Repository.PedidoRepository;
import com.ads.Lojinha.Repository.ProdutoRepository;
import com.ads.Lojinha.modelo.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CestaRepository cestaRepository;
    private final CestaService cestaService;
    private final ProdutoRepository produtoRepository;
    private final EmailService emailService;

    public PedidoService(PedidoRepository pedidoRepository,
                         CestaRepository cestaRepository,
                         CestaService cestaService,
                         ProdutoRepository produtoRepository,
                         EmailService emailService) {
        this.pedidoRepository = pedidoRepository;
        this.cestaRepository = cestaRepository;
        this.cestaService = cestaService;
        this.produtoRepository = produtoRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Pedido finalizar(String cpf) {
        Cesta cesta = cestaService.buscarPorCliente(cpf);

        if (cesta.getItens() == null || cesta.getItens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A cesta está vazia.");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cesta.getCliente());
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setItens(new ArrayList<>());

        double total = 0;

        for (ItemCesta itemCesta : cesta.getItens()) {
            Produto produto = itemCesta.getProduto();
            int quantidade = itemCesta.getQuantidade() != null ? itemCesta.getQuantidade() : 1;

            if (produto.getQuantidade() < quantidade) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Estoque insuficiente para o produto: " + produto.getNome()
                );
            }

            double preco = produto.getValorPromo() > 0 ? produto.getValorPromo() : produto.getValor();

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setQuantidade(quantidade);
            itemPedido.setPrecoUnitario(preco);
            pedido.getItens().add(itemPedido);

            total += preco * quantidade;
            produto.setQuantidade(produto.getQuantidade() - quantidade);
            produtoRepository.save(produto);
        }

        pedido.setTotal(total);
        Pedido salvo = pedidoRepository.save(pedido);

        cesta.getItens().clear();
        cesta.setValorTotal(0);
        cestaRepository.save(cesta);

        enviarEmailConfirmacaoPedido(salvo);

        return salvo;
    }

    public Pedido reenviarEmailConfirmacao(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
        enviarEmailConfirmacaoPedido(pedido);
        return pedido;
    }

    public List<Pedido> listarPorCliente(String cpf) {
        return pedidoRepository.findByClienteCpfOrderByDataPedidoDesc(cpf);
    }

    private void enviarEmailConfirmacaoPedido(Pedido pedido) {
        Cliente cliente = pedido.getCliente();
        if (cliente == null || cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            pedido.setEmailEnviado(false);
            pedido.setStatusEmail("Cliente sem e-mail cadastrado.");
            return;
        }

        if (!emailService.isConfigurado()) {
            String msg = "SMTP não configurado no application.properties / .env.";
            System.out.println("[PedidoService] " + msg + " Pedido #" + pedido.getId());
            pedido.setEmailEnviado(false);
            pedido.setStatusEmail(msg);
            return;
        }

        StringBuilder linhasItens = new StringBuilder();
        if (pedido.getItens() != null) {
            for (ItemPedido item : pedido.getItens()) {
                String nomeProduto = (item.getProduto() != null && item.getProduto().getNome() != null)
                        ? item.getProduto().getNome()
                        : "Relógio";
                int qtd = (item.getQuantidade() != null) ? item.getQuantidade() : 1;
                double precoUnit = (item.getPrecoUnitario() != null) ? item.getPrecoUnitario() : 0.0;
                double subtotal = precoUnit * qtd;

                linhasItens.append(String.format(
                        Locale.forLanguageTag("pt-BR"),
                        """
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">%s</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: center;">%d</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">R$ %.2f</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">R$ %.2f</td>
                        </tr>
                        """,
                        nomeProduto, qtd, precoUnit, subtotal
                ));
            }
        }

        LocalDateTime data = (pedido.getDataPedido() != null) ? pedido.getDataPedido() : LocalDateTime.now();
        String dataFormatada = data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        double total = (pedido.getTotal() != null) ? pedido.getTotal() : 0.0;
        String nomeCliente = (cliente.getNome() != null && !cliente.getNome().isBlank())
                ? cliente.getNome()
                : "Cliente";

        String blocoEndereco = (cliente.getEndereco() != null && !cliente.getEndereco().isBlank())
                ? "<p style='margin: 8px 0; color: #444;'><strong>Endereço de entrega:</strong> " + cliente.getEndereco() + "</p>"
                : "";

        String corpoHtml = String.format(
                Locale.forLanguageTag("pt-BR"),
                """
                <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
                    <div style="background-color: #2c2c2c; color: #ffffff; padding: 16px 20px; border-radius: 6px 6px 0 0;">
                        <h2 style="margin: 0; color: #09ff00;">Time<span style="color: #ffffff;">STOR</span> - Pedido Confirmado!</h2>
                    </div>

                    <div style="padding: 20px 4px;">
                        <p>Olá, <strong>%s</strong>!</p>
                        <p>Seu pedido <strong>#%d</strong> foi fechado com sucesso em <strong>%s</strong>.</p>
                        %s

                        <table style="width: 100%%; border-collapse: collapse; margin-top: 16px;">
                            <thead>
                                <tr style="background-color: #f4f4f4;">
                                    <th style="padding: 10px; text-align: left;">Produto</th>
                                    <th style="padding: 10px; text-align: center;">Qtd</th>
                                    <th style="padding: 10px; text-align: right;">Unitário</th>
                                    <th style="padding: 10px; text-align: right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                %s
                            </tbody>
                        </table>

                        <p style="font-size: 1.15rem; text-align: right; margin-top: 18px; color: #1b5e20;">
                            <strong>Total do Pedido: R$ %.2f</strong>
                        </p>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 0.85rem; color: #666; margin: 0;">Obrigado por comprar na TimeSTOR!</p>
                    </div>
                </div>
                """,
                nomeCliente,
                pedido.getId(),
                dataFormatada,
                blocoEndereco,
                linhasItens.toString(),
                total
        );

        try {
            emailService.enviarEmail(
                    cliente.getEmail(),
                    "Confirmação do Pedido #" + pedido.getId() + " - TimeSTOR",
                    corpoHtml
            );
            pedido.setEmailEnviado(true);
            pedido.setStatusEmail("E-mail de confirmação enviado para " + cliente.getEmail());
            System.out.println("[PedidoService] E-mail de confirmação enviado para " + cliente.getEmail() + " (Pedido #" + pedido.getId() + ")");
        } catch (Exception e) {
            pedido.setEmailEnviado(false);
            pedido.setStatusEmail(e.getMessage());
            System.err.println("[PedidoService] Pedido #" + pedido.getId() + " salvo, mas falhou ao enviar e-mail: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
