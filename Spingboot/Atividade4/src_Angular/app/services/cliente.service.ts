import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../components/model/cliente';
import { Login } from '../components/model/login';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly CHAVE_CLIENTES = 'app_clientes_registados';
  private readonly CHAVE_SESSAO = 'app_cliente_logado';

  private clienteLogadoSubject = new BehaviorSubject<Cliente | null>(this.obterSessaoAtiva());
  public clienteLogado$: Observable<Cliente | null> = this.clienteLogadoSubject.asObservable();

  constructor() {}

  /**
   * Obtém os clientes registados no LocalStorage
   */
  obterClientes(): Cliente[] {
    const dados = localStorage.getItem(this.CHAVE_CLIENTES);
    return dados ? JSON.parse(dados) : [];
  }

  /**
   * Regista um novo cliente
   */
  cadastrar(novoCliente: Cliente): { sucesso: boolean; mensagem: string } {
    const clientes = this.obterClientes();

    const emailExistente = clientes.some(c => c.email.toLowerCase() === novoCliente.email.toLowerCase());
    if (emailExistente) {
      return { sucesso: false, mensagem: 'Este e-mail já está registado.' };
    }

    novoCliente.codigo = Date.now();
    clientes.push(novoCliente);

    localStorage.setItem(this.CHAVE_CLIENTES, JSON.stringify(clientes));
    this.iniciarSessao(novoCliente);

    return { sucesso: true, mensagem: 'Registo realizado com sucesso!' };
  }

  /**
   * Valida as credenciais de login
   */
  login(dadosLogin: Login): { sucesso: boolean; mensagem: string } {
    const clientes = this.obterClientes();

    const clienteEncontrado = clientes.find(
      c => c.email.toLowerCase() === dadosLogin.email.toLowerCase() && c.senha === dadosLogin.senha
    );

    if (!clienteEncontrado) {
      return { sucesso: false, mensagem: 'E-mail ou palavra-passe incorretos.' };
    }

    this.iniciarSessao(clienteEncontrado);
    return { sucesso: true, mensagem: 'Login efetuado com sucesso!' };
  }

  /**
   * Termina a sessão do cliente (LOGOUT)
   */
  logout(): void {
    localStorage.removeItem(this.CHAVE_SESSAO);
    this.clienteLogadoSubject.next(null);
  }

  /**
   * Alias para manter compatibilidade caso chame removerCliente()
   */
  removerCliente(): void {
    this.logout();
  }

  /**
   * Inicia a sessão guardando os dados no LocalStorage
   */
  private iniciarSessao(cliente: Cliente): void {
    const { senha, ...clienteSemSenha } = cliente;
    localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify(clienteSemSenha));
    this.clienteLogadoSubject.next(clienteSemSenha);
  }

  /**
   * Lê o cliente atualmente autenticado
   */
  private obterSessaoAtiva(): Cliente | null {
    const dados = localStorage.getItem(this.CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  }

  /**
   * Retorna o valor atual do cliente logado
   */
  obterClienteAtual(): Cliente | null {
    return this.clienteLogadoSubject.value;
  }
}