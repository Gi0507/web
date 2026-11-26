import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CestaService } from '../../services/cesta.service';
import { ClienteService } from '../../services/cliente.service';
import { ItemCesta } from '../model/item-cesta';

interface ItemResumoPagamento {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pagamento.html',
  styleUrl: './pagamento.css'
})
export class Pagamento implements OnInit {
  private cestaService = inject(CestaService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  formaPagamento: 'PIX' | 'CARTAO' | 'BOLETO' = 'PIX';
  codigoPix = '00020126580014BR.GOV.BCB.PIX0136loja-relogios-pagamento';
  processando = false;

  dadosCartao = {
    numero: '',
    titular: '',
    validade: '',
    cvv: '',
    parcelas: 1
  };

  itens: ItemResumoPagamento[] = [];
  total = 0;

  ngOnInit(): void {
    const cliente = this.clienteService.obterClienteAtual();
    if (!cliente?.cpf) {
      alert('Faça login para concluir o pagamento.');
      this.router.navigate(['/login']);
      return;
    }

    this.carregarItensDaCesta();
  }

  private carregarItensDaCesta(): void {
    this.cestaService.obterItens().subscribe({
      next: (itensCesta: ItemCesta[]) => {
        this.itens = (itensCesta ?? []).map((item) => {
          const prod = item.produto;
          const valorNormal = Number(prod?.valor ?? 0);
          const valorPromo = Number(prod?.promo ?? 0);
          const precoUnitario =
            valorPromo > 0 && valorPromo < valorNormal ? valorPromo : valorNormal;

          return {
            id: Number(prod?.codigo ?? item.id ?? 0),
            nome: String(prod?.nome ?? 'Relógio TimeSTOR'),
            preco: precoUnitario,
            quantidade: Number(item.quantity ?? 1)
          };
        });

        this.total = this.itens.reduce(
          (acc, item) => acc + item.preco * item.quantidade,
          0
        );
        this.cdr.markForCheck();
      },
      error: (erro: any) => {
        console.error('Erro ao carregar itens da cesta para pagamento:', erro);
        this.itens = [];
        this.total = 0;
        this.cdr.markForCheck();
      }
    });
  }

  copiarCodigoPix(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.codigoPix).then(() => {
        alert('Código PIX copiado para a área de transferência!');
      });
    }
  }

  private validarDadosPagamento(): boolean {
    if (this.formaPagamento !== 'CARTAO') {
      return true;
    }

    const numeroLimpo = this.dadosCartao.numero.replace(/\D/g, '');
    const titular = this.dadosCartao.titular.trim();
    const validade = this.dadosCartao.validade.trim();
    const cvvLimpo = this.dadosCartao.cvv.replace(/\D/g, '');

    if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
      alert('Informe um número de cartão válido.');
      return false;
    }

    if (titular.length < 3) {
      alert('Informe o nome impresso no cartão.');
      return false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade)) {
      alert('Informe a validade do cartão no formato MM/AA.');
      return false;
    }

    if (cvvLimpo.length < 3 || cvvLimpo.length > 4) {
      alert('Informe um CVV válido (3 ou 4 dígitos).');
      return false;
    }

    return true;
  }

  finalizarPagamento(): void {
    if (!this.itens.length || this.processando) {
      return;
    }

    if (!this.validarDadosPagamento()) {
      return;
    }

    this.processando = true;
    this.cdr.markForCheck();

    const emailCliente = this.clienteService.obterClienteAtual()?.email;

    this.cestaService.finalizarPedido().subscribe({
      next: (pedido) => {
        this.processando = false;
        this.itens = [];
        this.total = 0;
        this.cdr.markForCheck();

        const emailOk = pedido.emailEnviado !== false;
        const avisoEmail =
          emailOk && emailCliente
            ? `\nEnviamos a confirmação com os detalhes da compra para ${emailCliente}.`
            : pedido.statusEmail
              ? `\nStatus do e-mail: ${pedido.statusEmail}`
              : '';

        alert(
          `Pedido #${pedido.id} registrado com sucesso! Forma selecionada: ${this.formaPagamento}.\n\nAtenção: esta versão registra o pedido, mas ainda não processa cobranças reais por PIX, cartão ou boleto.${avisoEmail}`
        );
        this.router.navigate(['/meus-pedidos']);
      },
      error: (erro: any) => {
        this.processando = false;
        this.cdr.markForCheck();
        const msg =
          erro.error?.detail ||
          erro.error?.message ||
          erro.message ||
          'Não foi possível concluir o pagamento no momento.';
        alert(msg);
      }
    });
  }
}

export { Pagamento as PagamentoComponent };