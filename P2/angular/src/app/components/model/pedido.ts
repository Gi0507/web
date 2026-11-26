import { Cliente } from './cliente';
import { Produto } from './produto';

export interface ItemPedido {
  id?: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: number;
  cliente?: Cliente;
  itens: ItemPedido[];
  dataPedido: string;
  total: number;
  emailEnviado?: boolean;
  statusEmail?: string;
}
