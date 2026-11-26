import { Produto } from './produto';

export class ItemCesta {
  id?: number;
  produto: Produto;
  quantity: number;
  valorTotal: number;

  constructor(produto: Produto, quantidade: number = 1, id?: number) {
    this.id = id;
    this.produto = produto;
    this.quantity = quantidade;
    const preco = produto.promo > 0 ? produto.promo : produto.valor;
    this.valorTotal = preco * quantidade;
  }
}
