import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CestaService } from '../../services/cesta.service';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css'
})
export class Vitrine implements OnInit {
  todosProdutos: any[] = [];
  produtosFiltrados: any[] = [];
  produtosOmnitrix: any[] = [];
  produtosSelecionados: any[] = [];
  produtosDestaque: any[] = [];
  termoBusca = '';

  constructor(
    private produtoService: ProdutoService,
    private cestaService: CestaService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();

    const prodSvc = this.produtoService as any;
    if (prodSvc.termoBusca$ && typeof prodSvc.termoBusca$.subscribe === 'function') {
      prodSvc.termoBusca$.subscribe((termo: string) => {
        this.termoBusca = termo || '';
        this.aplicarFiltro();
      });
    }

    this.route.queryParams.subscribe((params) => {
      const buscaUrl = params['busca'] ?? params['termo'] ?? params['q'];
      if (buscaUrl !== undefined) {
        this.termoBusca = buscaUrl;
        this.aplicarFiltro();
      }
    });
  }

  private carregarProdutos(): void {
    const prodSvc = this.produtoService as any;
    const requisicao$ =
      typeof prodSvc.listar === 'function'
        ? prodSvc.listar()
        : typeof prodSvc.listarTodos === 'function'
          ? prodSvc.listarTodos()
          : typeof prodSvc.listarProdutos === 'function'
            ? prodSvc.listarProdutos()
            : this.http.get<any[]>('http://localhost:8080/produtos');

    requisicao$.subscribe({
      next: (lista: any[]) => {
        this.todosProdutos = Array.isArray(lista) ? lista : [];
        this.aplicarFiltro();
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos da vitrine:', err);
        this.todosProdutos = [];
        this.aplicarFiltro();
      }
    });
  }

  aplicarFiltro(): void {
    const termo = this.termoBusca.trim().toLowerCase();

    if (!termo) {
      this.produtosFiltrados = [...this.todosProdutos];
    } else {
      this.produtosFiltrados = this.todosProdutos.filter((relogio) => {
        const nome = String(relogio.nome ?? '').toLowerCase();
        const categoria = String(relogio.categoria ?? '').toLowerCase();
        const descritivo = String(relogio.descritivo ?? relogio.descricao ?? '').toLowerCase();
        return nome.includes(termo) || categoria.includes(termo) || descritivo.includes(termo);
      });
    }

    this.organizarSecoes();
    this.cdr.markForCheck();
  }

  private embaralhar<T>(lista: T[]): T[] {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  private organizarSecoes(): void {
    const idsUsados = new Set<any>();

    this.produtosOmnitrix = this.produtosFiltrados.filter((p) => {
      const cat = String(p.categoria ?? '').toLowerCase();
      const nome = String(p.nome ?? '').toLowerCase();
      const ehOmnitrix = cat.includes('omnitrix') || nome.includes('omnitrix');
      if (ehOmnitrix) {
        idsUsados.add(p.codigo ?? p.id ?? p);
      }
      return ehOmnitrix;
    });

    const restantes = this.produtosFiltrados.filter((p) => !idsUsados.has(p.codigo ?? p.id ?? p));

    const marcadosSelecionados = restantes.filter(
      (p) => p.selecionado === true || String(p.categoria ?? '').toLowerCase().includes('selecionado')
    );

    if (marcadosSelecionados.length > 0) {
      this.produtosSelecionados = this.embaralhar(marcadosSelecionados).slice(0, 8);
      this.produtosSelecionados.forEach((p) => idsUsados.add(p.codigo ?? p.id ?? p));

      const disponiveisDestaque = restantes.filter((p) => !idsUsados.has(p.codigo ?? p.id ?? p));
      this.produtosDestaque = this.embaralhar(disponiveisDestaque).slice(0, 8);
    } else {
      const embaralhados = this.embaralhar(restantes);
      this.produtosSelecionados = embaralhados.slice(0, 8);
      this.produtosDestaque = embaralhados.slice(8, 16);
    }
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    const prodSvc = this.produtoService as any;
    if (typeof prodSvc.setTermoBusca === 'function') {
      prodSvc.setTermoBusca('');
    }
    this.aplicarFiltro();
  }

  renderizarEstrelas(estrelas: number): string {
    const total = Math.max(0, Math.min(5, Math.round(Number(estrelas) || 0)));
    return '★'.repeat(total) + '☆'.repeat(5 - total);
  }

  comprar(relogio: any): void {
    this.cestaService.adicionarProduto(relogio).subscribe({
      next: () => {
        this.router.navigate(['/cesta']);
      },
      error: (erro: any) => {
        alert(erro.error?.detail || erro.message || 'Não foi possível adicionar o produto à cesta.');
      }
    });
  }
}

export { Vitrine as VitrineComponent };