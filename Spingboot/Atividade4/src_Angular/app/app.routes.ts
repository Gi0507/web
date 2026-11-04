import { Routes } from '@angular/router';
import { Vitrine } from './components/vitrine/vitrine';
import { LoginComponent } from './components/login/login';
import { Cesta } from './components/cesta/cesta';
import { CadastroComponent } from './components/cadastro/cadastro';
import { Cliente } from './components/model/cliente';
import { Pesquisa } from './components/pesquisa/pesquisa';

export const routes: Routes = [
  { path: '', component: Vitrine },
  { path: 'login', component: LoginComponent },
  { path: 'cesta', component: Cesta },
  { path: 'cadastro', component: CadastroComponent }
  ];