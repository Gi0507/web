import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pesquisa.html',
  styleUrl: './pesquisa.css'
})
export class Pesquisa implements OnInit {
  @ViewChild('campoBusca') campoBusca?: ElementRef<HTMLInputElement>;

  termoBusca: string = '';
  private router = inject(Router);
  private produtoService = inject(ProdutoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.produtoService.termoBusca$.subscribe(termo => {
      if (this.termoBusca !== termo) {
        this.termoBusca = termo;
        this.cdr.markForCheck();
      }
    });
  }

  filtrarProdutos(): void {
    this.produtoService.setTermoBusca(this.termoBusca);

    if (this.termoBusca.trim().length > 0 && this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  buscar(): void {
    this.produtoService.setTermoBusca(this.termoBusca);
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.produtoService.setTermoBusca('');
    this.focarCampo();
  }

  focarCampo(): void {
    setTimeout(() => {
      this.campoBusca?.nativeElement?.focus();
    }, 0);
  }
}
