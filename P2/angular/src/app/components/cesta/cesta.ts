import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ItemCesta } from '../model/item-cesta';
import { CestaService } from '../../services/cesta.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cesta.html',
  styleUrl: './cesta.css'
})
export class Cesta implements OnInit {
  private cestaService = inject(CestaService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  mensagem = '';
  valorCesta = 0;
  itens: ItemCesta[] = [];
  carregando = false;

  ngOnInit(): void {
    this.carregarCesta();
  }

  carregarCesta(): void {
    this.carregando = true;
    this.cestaService.obterItens().subscribe({
      next: (itens: ItemCesta[]) => {
        this.itens = itens;
        this.calculaTotal();
        this.mensagem = '';
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro: any) => {
        this.itens = [];
        this.valorCesta = 0;
        this.mensagem = erro.error?.detail || erro.error?.message || erro.message || 'Não foi possível carregar a cesta.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  calculaTotal(): void {
    this.valorCesta = this.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
  }

  aumentar(codigo?: number): void {
    const item = this.localizar(codigo);
    if (!item) return;

    this.cestaService.alterarQuantidade(item, 1).subscribe({
      next: (itens: ItemCesta[]) => this.atualizar(itens),
      error: (erro: any) => this.mostrarErro(erro)
    });
  }

  diminuir(codigo?: number): void {
    const item = this.localizar(codigo);
    if (!item) return;

    this.cestaService.alterarQuantidade(item, -1).subscribe({
      next: (itens: ItemCesta[]) => this.atualizar(itens),
      error: (erro: any) => this.mostrarErro(erro)
    });
  }

  remover(codigo?: number): void {
    if (codigo === undefined) return;

    this.cestaService.removerItem(codigo).subscribe({
      next: (itens: ItemCesta[]) => this.atualizar(itens),
      error: (erro: any) => this.mostrarErro(erro)
    });
  }

  limpar(): void {
    this.cestaService.limparCesta().subscribe({
      next: (itens: ItemCesta[]) => this.atualizar(itens),
      error: (erro: any) => this.mostrarErro(erro)
    });
  }

  finalizarPedido(): void {
    if (this.itens.length === 0) {
      this.mensagem = 'Sua cesta está vazia.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.clienteService.obterClienteAtual()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/pagamento']);
  }

  private localizar(codigo?: number): ItemCesta | undefined {
    if (codigo === undefined) return undefined;
    return this.itens.find(item => item.produto.codigo === codigo);
  }

  private atualizar(itens: ItemCesta[]): void {
    this.itens = itens;
    this.calculaTotal();
    this.mensagem = '';
    this.cdr.markForCheck();
  }

  private mostrarErro(erro: any): void {
    this.mensagem = erro.error?.detail || erro.error?.message || erro.message || 'Erro ao atualizar a cesta.';
    this.cdr.markForCheck();
  }
}