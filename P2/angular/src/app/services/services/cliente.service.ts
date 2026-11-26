import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

import { Cliente } from '../components/model/cliente';
import { Login } from '../components/model/login';

interface LoginResposta {
  sucesso: boolean;
  mensagem: string;
  cliente?: Cliente;
}


export interface RecuperacaoResposta {
  sucesso: boolean;
  mensagem: string;
  codigo?: string;
  enviadoPorEmail?: boolean;
  modoDemonstracao?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly apiUrl = 'http://localhost:8080/clientes';
  private readonly CHAVE_SESSAO = 'app_cliente_logado';

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  private clienteLogadoSubject = new BehaviorSubject<Cliente | null>(null);
  public clienteLogado$: Observable<Cliente | null> = this.clienteLogadoSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.clienteLogadoSubject.next(this.obterSessaoAtiva());
    }
  }

  cadastrar(novoCliente: Cliente): Observable<{ sucesso: boolean; mensagem: string; cliente?: Cliente }> {
    const payload = {
      cpf: novoCliente.cpf ?? '',
      nome: novoCliente.nome,
      email: novoCliente.email,
      senha: novoCliente.senha ?? '',
      telefone: novoCliente.telefone ?? '',
      endereco: novoCliente.endereco ?? novoCliente.morada ?? ''
    };

    return this.http.post<Cliente>(this.apiUrl, payload).pipe(
      map(cliente => {
        this.iniciarSessao(cliente);
        return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!', cliente };
      }),
      catchError(erro => of({
        sucesso: false,
        mensagem: erro.error?.detail || erro.error?.message || erro.error?.mensagem || 'Não foi possível realizar o cadastro.'
      }))
    );
  }

  login(dadosLogin: Login): Observable<LoginResposta> {
    return this.http.post<LoginResposta>(`${this.apiUrl}/login`, dadosLogin).pipe(
      map(resposta => {
        if (resposta.sucesso && resposta.cliente) {
          this.iniciarSessao(resposta.cliente);
        }
        return resposta;
      }),
      catchError(erro => of({
        sucesso: false,
        mensagem: erro.error?.detail || erro.error?.message || erro.error?.mensagem || 'E-mail ou senha incorretos.'
      }))
    );
  }

  solicitarRecuperacaoSenha(email: string): Observable<RecuperacaoResposta> {
    return this.http.post<RecuperacaoResposta>(`${this.apiUrl}/recuperar-senha`, { email }).pipe(
      catchError(erro => of({
        sucesso: false,
        mensagem: erro.error?.detail || erro.error?.message || erro.error?.mensagem || 'Não foi possível gerar o código de recuperação.'
      }))
    );
  }

    redefinirSenha(dados: { email: string; codigo: string; novaSenha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, dados);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CHAVE_SESSAO);
    }
    this.clienteLogadoSubject.next(null);
  }

  removerCliente(): void {
    this.logout();
  }

  private iniciarSessao(cliente: Cliente): void {
    const { senha, ...clienteSemSenha } = cliente;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify(clienteSemSenha));
    }
    this.clienteLogadoSubject.next(clienteSemSenha);
  }

  private obterSessaoAtiva(): Cliente | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const dados = localStorage.getItem(this.CHAVE_SESSAO);
      if (!dados) return null;
      return JSON.parse(dados) as Cliente;
    } catch {
      localStorage.removeItem(this.CHAVE_SESSAO);
      return null;
    }
  }

  obterClienteAtual(): Cliente | null {
    let cliente = this.clienteLogadoSubject.value;

    if (!cliente && isPlatformBrowser(this.platformId)) {
      cliente = this.obterSessaoAtiva();
      if (cliente) {
        this.clienteLogadoSubject.next(cliente);
      }
    }

    return cliente;
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email });
  }


}
