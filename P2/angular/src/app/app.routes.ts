import { Routes } from '@angular/router';
import { Vitrine } from './components/vitrine/vitrine';
import { LoginComponent } from './components/login/login';
import { Cesta } from './components/cesta/cesta';
import { CadastroComponent } from './components/cadastro/cadastro';
import { MeusPedidos } from './components/meus-pedidos/meus-pedidos';
import { Pagamento } from './components/pagamento/pagamento';

export const routes: Routes = [
  { path: '', component: Vitrine },
  { path: 'login', component: LoginComponent },
  { path: 'cesta', component: Cesta },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'meus-pedidos', component: MeusPedidos },
  { path: 'pagamento', component: Pagamento }
];
