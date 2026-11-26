import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Pedido } from '../components/model/pedido';
import { Produto } from '../components/model/produto';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly apiUrl = 'http://localhost:8080/pedidos';
  private http = inject(HttpClient);
  private clienteService = inject(ClienteService);

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
          prod.imagem = this.inferirImagem(prod.nome);

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

  private inferirImagem(nome: string): string {
    const n = (nome || '').toLowerCase();
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
