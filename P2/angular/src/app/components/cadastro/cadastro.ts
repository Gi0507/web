import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../model/cliente';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class CadastroComponent {
  novoCliente: Cliente = {
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: ''
  };

  mensagemErro = '';
  mensagemSucesso = '';
  enviando = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  cadastrar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.novoCliente.nome || !this.novoCliente.email || !this.novoCliente.senha || !this.novoCliente.cpf) {
      this.mensagemErro = 'Por favor, preencha nome, CPF, e-mail e senha.';
      return;
    }

    this.enviando = true;
    this.clienteService.cadastrar(this.novoCliente).subscribe(resultado => {
      this.enviando = false;

      if (resultado.sucesso) {
        this.mensagemSucesso = resultado.mensagem;
        const nome = resultado.cliente?.nome?.trim() || this.novoCliente.nome.trim();
        alert(`Cadastro realizado com sucesso!\n\nBem-vindo(a), ${nome}! Sua conta já está logada.`);
        this.router.navigate(['/']);
      } else {
        this.mensagemErro = resultado.mensagem;
      }

      this.cdr.markForCheck();
    });
  }
}
