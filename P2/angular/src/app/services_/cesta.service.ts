import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { ItemCesta } from '../components/model/item-cesta';
import { Produto } from '../components/model/produto';
import { ClienteService } from './cliente.service';

interface ProdutoCestaApi {
  id: number;
  nome: string;
  descritivo: string;
  valor: number;
  valorPromo: number;
  quantidade: number;
  destaque: number;
}

interface ItemCestaApi {
  id: number;
  produto: ProdutoCestaApi;
  quantidade: number;
}

interface CestaApi {
  id: number;
  itens: ItemCestaApi[];
  valorTotal: number;
}

export interface PedidoApi {
  id: number;
  dataPedido: string;
  total: number;
  emailEnviado?: boolean;
  statusEmail?: string;
}

@Injectable({ providedIn: 'root' })
export class CestaService {
  private readonly apiUrl = 'http://localhost:8080/cestas';
  private readonly pedidosUrl = 'http://localhost:8080/pedidos';
  private http = inject(HttpClient);
  private clienteService = inject(ClienteService);

  obterItens(): Observable<ItemCesta[]> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login para acessar a cesta.'));

    return this.http.get<CestaApi>(`${this.apiUrl}/cliente/${encodeURIComponent(cpf)}`).pipe(
      map(cesta => this.mapearItens(cesta))
    );
  }

  adicionarProduto(produto: Produto, quantidade: number = 1): Observable<ItemCesta[]> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login antes de adicionar produtos à cesta.'));

    const params = new HttpParams()
      .set('produtoId', produto.codigo)
      .set('quantidade', quantidade);

    return this.http.post<CestaApi>(`${this.apiUrl}/${encodeURIComponent(cpf)}/itens`, null, { params }).pipe(
      map(cesta => this.mapearItens(cesta))
    );
  }

  alterarQuantidade(item: ItemCesta, delta: number): Observable<ItemCesta[]> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login para alterar a cesta.'));

    const novaQuantidade = item.quantity + delta;
    if (novaQuantidade <= 0) {
      return this.removerItem(item.produto.codigo);
    }

    const params = new HttpParams().set('quantidade', novaQuantidade);
    return this.http.put<CestaApi>(
      `${this.apiUrl}/${encodeURIComponent(cpf)}/itens/${item.produto.codigo}`,
      null,
      { params }
    ).pipe(map(cesta => this.mapearItens(cesta)));
  }

  removerItem(produtoId: number): Observable<ItemCesta[]> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login para alterar a cesta.'));

    return this.http.delete<CestaApi>(
      `${this.apiUrl}/${encodeURIComponent(cpf)}/itens/${produtoId}`
    ).pipe(map(cesta => this.mapearItens(cesta)));
  }

  limparCesta(): Observable<ItemCesta[]> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login para alterar a cesta.'));

    return this.http.delete<CestaApi>(`${this.apiUrl}/${encodeURIComponent(cpf)}/itens`).pipe(
      map(cesta => this.mapearItens(cesta))
    );
  }

  finalizarPedido(): Observable<PedidoApi> {
    const cpf = this.obterCpf();
    if (!cpf) return throwError(() => new Error('Faça login para finalizar o pedido.'));

    return this.http.post<PedidoApi>(
      `${this.pedidosUrl}/finalizar/${encodeURIComponent(cpf)}`,
      {}
    );
  }

  private obterCpf(): string | null {
    const cpf = this.clienteService.obterClienteAtual()?.cpf?.trim();
    return cpf ? cpf : null;
  }

  private mapearItens(cesta: CestaApi): ItemCesta[] {
    return (cesta.itens ?? []).map(item => {
      const produto = new Produto();
      produto.codigo = item.produto.id;
      produto.nome = item.produto.nome ?? '';
      produto.descritivo = item.produto.descritivo ?? '';
      produto.valor = Number(item.produto.valor ?? 0);
      produto.promo = Number(item.produto.valorPromo ?? 0);
      produto.quantidade = Number(item.produto.quantidade ?? 0);
      produto.estrelas = Number(item.produto.destaque ?? 0) > 0 ? 5 : 4;
      produto.imagem = this.inferirImagem(produto.nome);

      return new ItemCesta(produto, item.quantidade, item.id);
    });
  }

  private inferirImagem(nome: string): string {
    const n = nome.toLowerCase();
    if (n.includes('ultimatrix')) return 'relogios/ominitrix/ominitrix 3.webp';
    if (n.includes('omnitrix') && n.includes('custom')) return 'relogios/ominitrix/ominitrix2.webp';
    if (n.includes('omnitrix')) return 'relogios/ominitrix/ominitrix.webp';
    if (n.includes('dw-6900')) return 'relogios/dw-6900.avif';
    if (n.includes('7900')) return 'relogios/g-7900a-4dr_1.png';
    if (n.includes('gba-900')) return 'relogios/gba-900CB.avif';
    if (n.includes('gba-950')) return 'relogios/gba-950.avif';
    if (n.includes('gmw') || n.includes('b5000')) return 'relogios/gmw5000.avif';
    if (n.includes('datejust')) return 'relogios/rolex3.webp';
    if (n.includes('oyster')) return 'relogios/rolex4.webp';
    if (n.includes('daytona')) return 'relogios/rolex5.webp';
    if (n.includes('rolex')) return 'relogios/rolex1.webp';
    if (n.includes('apple')) return 'relogios/Aplewhat.webp';
    if (n.includes('kit') || n.includes('fone')) return 'relogios/promoção smartwath e fone.webp';
    if (n.includes('smart')) return 'relogios/smartwhat.webp';
    return 'relogios/g-7900a-4dr_1.png';
  }
}
