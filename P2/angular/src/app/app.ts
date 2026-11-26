import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Pesquisa } from './components/pesquisa/pesquisa';
import { ClienteService } from './services/cliente.service';
import { Cliente } from './components/model/cliente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, Pesquisa],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild(Pesquisa) pesquisaComp?: Pesquisa;

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isMenuOpen = false;
  isPesquisa = true;
  clienteLogado: Cliente | null = null;

  ngOnInit(): void {
    this.clienteService.clienteLogado$.subscribe((cliente) => {
      this.clienteLogado = cliente;
      this.cdr.markForCheck();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  togglePesquisa(): void {
    this.isPesquisa = true;
    this.pesquisaComp?.focarCampo();
  }

  sair(): void {
    this.clienteService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
