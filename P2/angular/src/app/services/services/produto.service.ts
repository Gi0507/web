import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Produto } from '../components/model/produto';
import { resolverImagemProduto } from './imagem-relogio.util';

interface ProdutoApi {
  id: number;
  nome: string;
  descritivo: string;
  valor: number;
  valorPromo: number;
  quantidade: number;
  destaque: number;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/produtos';

  private termoBuscaSubject = new BehaviorSubject<string>('');
  public readonly termoBusca$: Observable<string> = this.termoBuscaSubject.asObservable();

  setTermoBusca(termo: string): void {
    this.termoBuscaSubject.next(termo ?? '');
  }

  obterTermoBuscaAtual(): string {
    return this.termoBuscaSubject.value;
  }

  listarProdutos(): Observable<Produto[]> {
    return this.http.get<ProdutoApi[]>(this.apiUrl).pipe(
      map(produtos => produtos.map(produto => this.mapearProduto(produto)))
    );
  }

  listar(): Observable<Produto[]> {
    return this.listarProdutos();
  }

  buscarNoBackend(termo: string): Observable<Produto[]> {
    const params = new HttpParams().set('termo', termo.trim());
    return this.http.get<ProdutoApi[]>(`${this.apiUrl}/buscar`, { params }).pipe(
      map(produtos => produtos.map(produto => this.mapearProduto(produto)))
    );
  }

  buscarPorTermo(termo: string): Observable<Produto[]> {
    const termoNormalizado = termo.trim().toLowerCase();
    return this.listarProdutos().pipe(
      map(produtos =>
        produtos.filter(
          p =>
            p.nome.toLowerCase().includes(termoNormalizado) ||
            p.descritivo.toLowerCase().includes(termoNormalizado) ||
            p.categoria.toLowerCase().includes(termoNormalizado)
        )
      )
    );
  }

  private mapearProduto(api: ProdutoApi): Produto {
    const produto = new Produto();
    produto.codigo = api.id;
    produto.nome = api.nome ?? '';
    produto.descritivo = api.descritivo ?? '';
    produto.valor = Number(api.valor ?? 0);
    produto.promo = Number(api.valorPromo ?? 0);
    produto.quantidade = Number(api.quantidade ?? 0);
    produto.estrelas = api.destaque > 0 ? 5 : 4;
    produto.categoria = this.inferirCategoria(produto.nome);
    produto.imagem = resolverImagemProduto(produto.nome);
    return produto;
  }

  private inferirCategoria(nome: string): string {
    const n = nome.toLowerCase();
    if (n.includes('omnitrix') || n.includes('ultimatrix')) return 'Especial';
    if (n.includes('rolex') || n.includes('omega') || n.includes('seamaster') || n.includes('tag heuer') || n.includes('tissot')) return 'Luxo';
    if (n.includes('smart') || n.includes('apple') || n.includes('galaxy') || n.includes('garmin') || n.includes('forerunner')) return 'Smartwatch';
    if (n.includes('vivara') || n.includes('parker') || n.includes('rose') || n.includes('jacqueline')) return 'Feminino';
    return 'Masculino';
  }

}
