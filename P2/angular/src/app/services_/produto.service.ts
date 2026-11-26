import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Produto } from '../components/model/produto';

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
    produto.imagem = this.inferirImagem(produto.nome);
    return produto;
  }

  private inferirCategoria(nome: string): string {
    const n = nome.toLowerCase();
    if (n.includes('omnitrix')) return 'Especial';
    if (n.includes('rolex')) return 'Luxo';
    if (n.includes('smart') || n.includes('apple') || n.includes('watch')) return 'Smartwatch';
    return 'Masculino';
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
    if (n.includes('citizen')) return 'relogios/citizen.jpg';
    if (n.includes('vivara')) return 'relogios/vivara.jpg';
    if (n.includes('bulova')) return 'relogios/bulova.jpg';
    if (n.includes('tag heuer')) return 'relogios/tag-heuer.jpg';
    return 'relogios/g-7900a-4dr_1.png';
  }
}