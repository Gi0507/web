import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Pedido } from '../model/pedido';
import { Cliente } from '../model/cliente';
import { PedidoService } from '../../services/pedido.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos implements OnInit {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  clienteLogado: Cliente | null = null;
  carregando = true;
  erroMensagem = '';
  avisoAcao = '';
  reenviandoId: number | null = null;

  ngOnInit(): void {
    this.clienteLogado = this.clienteService.obterClienteAtual();

    if (!this.clienteLogado?.cpf) {
      this.carregando = false;
      this.erroMensagem = 'Faça login para visualizar seus pedidos.';
      this.cdr.markForCheck();
      return;
    }

    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.erroMensagem = '';

    this.pedidoService.listarMeusPedidos().subscribe({
      next: (dados: Pedido[]) => {
        this.pedidos = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro: any) => {
        this.erroMensagem =
          erro.error?.detail ||
          erro.error?.message ||
          erro.message ||
          'Não foi possível carregar seus pedidos.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  reenviarEmail(pedidoId: number): void {
    this.reenviandoId = pedidoId;
    this.avisoAcao = '';

    this.pedidoService.reenviarEmail(pedidoId).subscribe({
      next: (pedidoAtualizado) => {
        this.reenviandoId = null;
        this.avisoAcao =
          pedidoAtualizado.statusEmail ||
          `Comprovante do pedido #${pedidoId} reenviado por e-mail.`;
        this.cdr.markForCheck();
      },
      error: (erro: any) => {
        this.reenviandoId = null;
        this.avisoAcao =
          erro.error?.detail ||
          erro.error?.message ||
          'Não foi possível reenviar o e-mail deste pedido.';
        this.cdr.markForCheck();
      }
    });
  }

  formatarMoeda(valor?: number): string {
    return (Number(valor) || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
