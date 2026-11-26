import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Pedido } from '../components/model/pedido';
import { Produto } from '../components/model/produto';
import { ClienteService } from './cliente.service';
import { resolverImagemProduto } from './imagem-relogio.util';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly apiUrl = 'http://localhost:8080/pedidos';
  private http = inject(HttpClient);
  private clienteService = inject(ClienteService);

  finalizarPedido(): Observable<Pedido> {
    const cpf = this.clienteService.obterClienteAtual()?.cpf?.trim();
    if (!cpf) {
      return throwError(() => new Error('Faça login para finalizar o pedido.'));
    }

    return this.http.post<any>(`${this.apiUrl}/finalizar/${encodeURIComponent(cpf)}`, {}).pipe(
      map(raw => this.mapearPedido(raw))
    );
  }

  listarMeusPedidos(): Observable<Pedido[]> {
    const cpf = this.clienteService.obterClienteAtual()?.cpf?.trim();
    if (!cpf) {
      return throwError(() => new Error('Faça login para visualizar seus pedidos.'));
    }

    return this.http.get<any[]>(`${this.apiUrl}/cliente/${encodeURIComponent(cpf)}`).pipe(
      map(lista => (Array.isArray(lista) ? lista.map(p => this.mapearPedido(p)) : []))
    );
  }

  reenviarEmail(pedidoId: number): Observable<Pedido> {
    return this.http.post<any>(`${this.apiUrl}/${pedidoId}/reenviar-email`, {}).pipe(
      map(p => this.mapearPedido(p))
    );
  }

  private mapearPedido(raw: any): Pedido {
    const itensMapeados = Array.isArray(raw?.itens)
      ? raw.itens.map((item: any) => {
          const prod = new Produto();
          prod.codigo = Number(item?.produto?.id ?? item?.produto?.codigo ?? 0);
          prod.nome = item?.produto?.nome ?? 'Relógio';
          prod.descritivo = item?.produto?.descritivo ?? '';
          prod.valor = Number(item?.produto?.valor ?? 0);
          prod.promo = Number(item?.produto?.valorPromo ?? item?.produto?.promo ?? 0);
          prod.quantidade = Number(item?.produto?.quantidade ?? 0);
          prod.imagem = resolverImagemProduto(prod.nome);

          return {
            id: item?.id,
            produto: prod,
            quantidade: Number(item?.quantidade ?? 1),
            precoUnitario: Number(item?.precoUnitario ?? prod.promo ?? prod.valor ?? 0)
          };
        })
      : [];

    return {
      id: Number(raw?.id ?? 0),
      cliente: raw?.cliente,
      itens: itensMapeados,
      dataPedido: raw?.dataPedido ?? '',
      total: Number(raw?.total ?? 0),
      emailEnviado: raw?.emailEnviado,
      statusEmail: raw?.statusEmail
    };
  }

}
