import { Produto } from "./produto";    

export class ItemCesta {
    produto: Produto | undefined;
    quantity: number=0;
    precoTotal: number | undefined;
    
}