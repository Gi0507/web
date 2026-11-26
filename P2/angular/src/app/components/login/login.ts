import { ChangeDetectorRef, Component } from '@angular/core';
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
  dadosLogin: Login = { email: '', senha: '' };
  mensagemErro = '';
  entrando = false;
  recuperando = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  entrar(): void {
    this.mensagemErro = '';

    if (!this.dadosLogin.email || !this.dadosLogin.senha) {
      this.mensagemErro = 'Preencha o e-mail e a senha.';
      return;
    }

    this.entrando = true;
    this.clienteService.login(this.dadosLogin).subscribe(resultado => {
      this.entrando = false;

      if (resultado.sucesso) {
        const nome = resultado.cliente?.nome?.trim();
        alert(nome
          ? `Login realizado com sucesso!

Olá, ${nome}! Seja bem-vindo(a) e boas compras!`
          : 'Login realizado com sucesso! Seja bem-vindo(a) e boas compras!'
        );
        this.router.navigate(['/']);
      } else {
        this.mensagemErro = resultado.mensagem;
      }

      this.cdr.markForCheck();
    });
  }

  esqueciSenha(): void {
    this.mensagemErro = '';
    const email = this.dadosLogin.email.trim();

    if (!email) {
      alert('Digite seu e-mail no campo acima e depois clique novamente em "Esqueci a minha senha".');
      return;
    }

    this.recuperando = true;
    this.clienteService.solicitarRecuperacaoSenha(email).subscribe(resultado => {
      this.recuperando = false;

      if (!resultado.sucesso) {
        this.mensagemErro = resultado.mensagem;
        this.cdr.markForCheck();
        return;
      }

      if (resultado.enviadoPorEmail || !resultado.codigo) {
        alert(
          `Enviamos um código de recuperação de 6 dígitos diretamente para ${email}.

` +
          'Verifique sua caixa de entrada (ou spam) e digite o código a seguir. Ele vale por 10 minutos.'
        );
      } else {
        alert(
          `Código de recuperação: ${resultado.codigo}

` +
          'O servidor SMTP ainda não foi configurado no arquivo .env do backend. O código vale por 10 minutos.'
        );
      }

      const codigoDigitado = prompt('Digite o código de recuperação:');
      if (!codigoDigitado) {
        this.cdr.markForCheck();
        return;
      }

      const novaSenha = prompt('Digite a nova senha (mínimo 4 caracteres):');
      if (!novaSenha) {
        this.cdr.markForCheck();
        return;
      }

      const confirmarSenha = prompt('Digite novamente a nova senha:');
      if (confirmarSenha !== novaSenha) {
        alert('As senhas não coincidem. Tente novamente.');
        this.cdr.markForCheck();
        return;
      }

      this.clienteService.redefinirSenha({ email, codigo: codigoDigitado, novaSenha }).subscribe({
        next: (resposta: any) => {
          if (resposta?.sucesso !== false) {
            alert('Senha alterada com sucesso! Agora você já pode entrar com a nova senha.');
            this.dadosLogin.senha = '';
            this.mensagemErro = '';
          } else {
            this.mensagemErro = resposta.mensagem || 'Não foi possível redefinir a senha.';
          }
          this.cdr.markForCheck();
        },
        error: (erro: any) => {
          this.mensagemErro = erro.error?.detail || erro.error?.message || 'Código inválido ou expirado.';
          this.cdr.markForCheck();
        }
      });
    });
  }
}

export type { Login } from '../model/login';
