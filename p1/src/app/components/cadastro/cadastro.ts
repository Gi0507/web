import { Component } from '@angular/core';
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
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    morada: ''
  };

  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  cadastrar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.novoCliente.nome || !this.novoCliente.email || !this.novoCliente.senha) {
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios (*).';
      return;
    }

    const resultado = this.clienteService.cadastrar(this.novoCliente);

    if (resultado.sucesso) {
      this.mensagemSucesso = resultado.mensagem;
      setTimeout(() => {
        this.router.navigate(['/']); // Redireciona para a vitrine
      }, 1500);
    } else {
      this.mensagemErro = resultado.mensagem;
    }
  }
}