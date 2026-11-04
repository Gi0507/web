import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../model/cliente'; // Caminho corrigido

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class ClienteComponent implements OnInit {
  cliente: Cliente = {
    nome: '',
    email: '',
    telefone: '',
    morada: '',
    nif: ''
  };

  mensagemSucesso: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    const clienteGuardado = this.clienteService.obterClienteAtual();
    if (clienteGuardado) {
      this.cliente = { ...clienteGuardado };
    }
  }

  salvar(): void {
    if (!this.cliente.nome || !this.cliente.email) {
      alert('Por favor, preencha pelo menos o Nome e o Email.');
      return;
    }

    this.clienteService.cadastrar(this.cliente);
    this.mensagemSucesso = 'Dados do cliente guardados com sucesso!';

    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3000);
  }

  limpar(): void {
    this.clienteService.logout(); // Chama o método de logout do serviço
    this.cliente = {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      nif: ''
    };
  }

  
}