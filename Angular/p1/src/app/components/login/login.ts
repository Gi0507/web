import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Login } from '../model/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  dadosLogin: Login = {
    email: '',
    senha: ''
  };

  mensagemErro: string = '';
  nomeCliente: any;

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  entrar(): void {
    this.mensagemErro = '';

    if (!this.dadosLogin.email || !this.dadosLogin.senha) {
      this.mensagemErro = 'Preencha o e-mail e a palavra-passe.';
      return;
    }

    const resultado = this.clienteService.login(this.dadosLogin);

    if (resultado.sucesso) {
      this.router.navigate(['/']); // Redireciona para a vitrine
    } else {
      this.mensagemErro = resultado.mensagem;
    }
    if (this.nomeCliente.trim()) {
      alert(`Olá, ${this.nomeCliente}! Seja bem-vindo(a) e boas compras!`);
    } else {
      alert('Seja bem-vindo(a) e boas compras!');
    }
  }
  esqueciSenha(): void {
    const email = this.dadosLogin.email.trim();

    if (!email) {
      alert('Por favor, preencha o campo de e-mail antes de solicitar a recuperação de senha.');
      return;
    }

    // Exibe o pop-up com o e-mail informado
    alert(`Um e-mail de recuperação de senha foi enviado para: ${email}`);
  }
}

export type { Login } from '../model/login';
