import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Produto } from '../model/produto';
import { CestaService } from '../../services/cesta.service';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css'
})
export class Vitrine implements OnInit {

  categoriaAtiva: string = 'todos';
  pesquisaAberta: boolean = false;
  termoBusca: string = '';

  listaProdutos: Produto[] = [
    {
      codigo: 100,
      nome: 'Omnitrix Ultimatrix Deluxe Edition',
      descritivo: 'Dispositivo alienígena com efeitos sonoros originais, luzes LED e seletor digital de transformações.',
      categoria: 'Especial',
      quantidade: 1,
      valor: 599.00,
      promo: 499.00,
      estrelas: 5,
      imagem: 'relogios/ominitrix/ominitrix 3.webp'
    },
    {
      codigo: 101,
      nome: 'Omnitrix Special Edition',
      descritivo: 'Edição especial do clássico relógio alienígena com iluminação LED.',
      categoria: 'Especial',
      quantidade: 5,
      valor: 450.00,
      promo: 380.00,
      estrelas: 5,
      imagem: 'relogios/ominitrix/ominitrix.webp'
    },
    {
      codigo: 102,
      nome: 'Omnitrix FX Custom',
      descritivo: 'Modelo customizado com efeitos sonoros e seletores interativos.',
      categoria: 'Especial',
      quantidade: 3,
      valor: 520.00,
      promo: 450.00,
      estrelas: 5,
      imagem: 'relogios/ominitrix/ominitrix2.webp'
    },
    {
      codigo: 103,
      nome: 'Relógio G-Shock DW-6900',
      descritivo: 'Modelo digital de alta resistência, à prova d\'água até 200m com luz de fundo EL.',
      categoria: 'Masculino',
      quantidade: 10,
      valor: 650.00,
      promo: 520.00,
      estrelas: 5,
      imagem: 'relogios/dw-6900.avif'
    },
    {
      codigo: 104,
      nome: 'Relógio G-Shock G-7900A Red',
      descritivo: 'Cronômetro duplo, gráfico de marés e fases da lua para desportos radicais.',
      categoria: 'Masculino',
      quantidade: 8,
      valor: 580.00,
      promo: 490.00,
      estrelas: 4,
      imagem: 'relogios/g-7900a-4dr_1.png'
    },
    {
      codigo: 105,
      nome: 'Relógio G-Shock GBA-900CB',
      descritivo: 'Conectividade Bluetooth, contador de passos e treino integrado na aplicação.',
      categoria: 'Masculino',
      quantidade: 12,
      valor: 890.00,
      promo: 0,
      estrelas: 4,
      imagem: 'relogios/gba-900CB.avif'
    },
    {
      codigo: 106,
      nome: 'Relógio G-Shock GBA-950',
      descritivo: 'Design desportivo com sensor de aceleração e rastreamento de atividades.',
      categoria: 'Masculino',
      quantidade: 6,
      valor: 920.00,
      promo: 790.00,
      estrelas: 5,
      imagem: 'relogios/gba-950.avif'
    },
    {
      codigo: 107,
      nome: 'Relógio G-Shock Full Metal GMW-B5000',
      descritivo: 'Caixa e bracelete totalmente em aço inoxidável com energia solar e ajuste via rádio.',
      categoria: 'Masculino',
      quantidade: 4,
      valor: 2400.00,
      promo: 2100.00,
      estrelas: 5,
      imagem: 'relogios/gmw5000.avif'
    },
    {
      codigo: 108,
      nome: 'Relógio Rolex Submariner Classic',
      descritivo: 'Ícone dos relógios de mergulho, em aço Oystersteel com bisel cerâmico Cerachrom.',
      categoria: 'Luxo',
      quantidade: 2,
      valor: 15000.00,
      promo: 0,
      estrelas: 5,
      imagem: 'relogios/rolex1.webp'
    },
    {
      codigo: 109,
      nome: 'Relógio Rolex Datejust Premium',
      descritivo: 'Mostrador refinado, movimento automático mecânico e bracelete Jubileu.',
      categoria: 'Luxo',
      quantidade: 3,
      valor: 18500.00,
      promo: 16900.00,
      estrelas: 5,
      imagem: 'relogios/rolex3.webp'
    },
    {
      codigo: 110,
      nome: 'Relógio Rolex Oyster Perpetual',
      descritivo: 'Estilo intemporal em aço inoxidável com mostrador elegante e alta precisão.',
      categoria: 'Luxo',
      quantidade: 5,
      valor: 12800.00,
      promo: 0,
      estrelas: 5,
      imagem: 'relogios/rolex4.webp'
    },
    {
      codigo: 111,
      nome: 'Relógio Rolex Cosmograph Daytona Gold',
      descritivo: 'Cronógrafo lendário com acabamento em ouro e escala taquimétrica gravada.',
      categoria: 'Luxo',
      quantidade: 1,
      valor: 32000.00,
      promo: 29500.00,
      estrelas: 5,
      imagem: 'relogios/rolex5.webp'
    },
    {
      codigo: 112,
      nome: 'Kit Smartwatch + Fone Bluetooth',
      descritivo: 'Combo promocional com smartwatch inteligente e auscultadores sem fios de alta qualidade.',
      categoria: 'Smartwatch',
      quantidade: 1,
      valor: 499.00,
      promo: 349.90,
      estrelas: 5,
      imagem: 'relogios/promoção smartwath e fone.webp'
    },
    {
      codigo: 113,
      nome: 'Smartwatch Sport Fit',
      descritivo: 'Relógio inteligente multifuncional com medição de ritmo cardíaco e monitorização de atividades desportivas.',
      categoria: 'Smartwatch',
      quantidade: 1,
      valor: 299.00,
      promo: 0.00,
      estrelas: 4,
      imagem: 'relogios/smartwhat.webp'
    },
    {
      codigo: 114,
      nome: 'Apple Watch Series',
      descritivo: 'Smartwatch com monitorização de saúde, GPS integrado e ecrã Retina de alta resolução.',
      categoria: 'Smartwatch',
      quantidade: 1,
      valor: 2499.00,
      promo: 2199.00,
      estrelas: 5,
      imagem: 'relogios/Aplewhat.webp'
    }
  ];

  private _produtosSelecionados: Produto[] = [];
  private _produtosDestaque: Produto[] = [];
  private _produtosOmnitrix: Produto[] = [];

  constructor(
    private cestaService: CestaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    if (
      this.produtoService &&
      typeof this.produtoService.listarProdutos === 'function'
    ) {
      const resultado: any = this.produtoService.listarProdutos();

      if (
        resultado &&
        typeof resultado === 'object' &&
        'subscribe' in resultado
      ) {
        resultado.subscribe({
          next: (dados: Produto[]) => {
            if (Array.isArray(dados) && dados.length > 0) {
              this.listaProdutos = dados;
            }

            this.atualizarListas();
          },
          error: (err: any) => {
            console.error(
              'Erro ao carregar produtos do serviço:',
              err
            );

            this.atualizarListas();
          }
        });
      } else {
        this.atualizarListas();
      }
    } else {
      this.atualizarListas();
    }
  }

  private atualizarListas(): void {
    const produtos = this.listaProdutos || [];

    this._produtosOmnitrix = produtos.filter(
      p =>
        p &&
        p.categoria?.toLowerCase() === 'especial'
    );

    this._produtosDestaque = produtos.filter(
      p =>
        p &&
        Number(p.promo) > 0 &&
        p.categoria?.toLowerCase() !== 'especial'
    );

    this._produtosSelecionados = produtos.filter(
      p =>
        p &&
        (
          !p.promo ||
          Number(p.promo) === 0
        )
    );
  }

  get produtosFiltrados(): Produto[] {
    if (!Array.isArray(this.listaProdutos)) {
      return [];
    }

    const termo = (this.termoBusca || '')
      .trim()
      .toLowerCase();

    return this.listaProdutos.filter(produto => {
      if (!produto) {
        return false;
      }

      const categoria = produto.categoria
        ? produto.categoria.toLowerCase()
        : '';

      const nome = produto.nome
        ? produto.nome.toLowerCase()
        : '';

      const descritivo = produto.descritivo
        ? produto.descritivo.toLowerCase()
        : '';

      const bateuCategoria =
        this.categoriaAtiva === 'todos' ||
        categoria === this.categoriaAtiva.toLowerCase();

      const bateuBusca =
        !termo ||
        nome.includes(termo) ||
        descritivo.includes(termo) ||
        categoria.includes(termo);

      return bateuCategoria && bateuBusca;
    });
  }

  get produtosOmnitrix(): Produto[] {
    return this.produtosFiltrados.filter(
      p =>
        p &&
        p.categoria?.toLowerCase() === 'especial'
    );
  }

  set produtosOmnitrix(value: Produto[]) {
    this._produtosOmnitrix = value || [];
  }

  get produtosDestaque(): Produto[] {
    return this.produtosFiltrados.filter(
      p =>
        p &&
        Number(p.promo) > 0 &&
        p.categoria?.toLowerCase() !== 'especial'
    );
  }

  set produtosDestaque(value: Produto[]) {
    this._produtosDestaque = value || [];
  }

  get produtosSelecionados(): Produto[] {
    return this.produtosFiltrados.filter(
      p =>
        p &&
        (
          !p.promo ||
          Number(p.promo) === 0
        )
    );
  }

  set produtosSelecionados(value: Produto[]) {
    this._produtosSelecionados = value || [];
  }

  filtrarProdutos(): void {
    this.atualizarListas();
  }

  filtrarPor(categoria: string): void {
    this.categoriaAtiva = categoria;
  }

  alternarPesquisa(): void {
    this.pesquisaAberta = !this.pesquisaAberta;

    if (!this.pesquisaAberta) {
      this.termoBusca = '';
    }
  }

  renderizarEstrelas(qtd: number): string {
    const total = Math.max(
      0,
      Math.min(
        5,
        Number(qtd) || 0
      )
    );

    return (
      '★'.repeat(total) +
      '☆'.repeat(5 - total)
    );
  }

  comprar(relogio: Produto): void {
    this.cestaService.adicionarProduto(relogio);

    alert(
      `${relogio.nome} foi adicionado à cesta!`
    );
  }
}