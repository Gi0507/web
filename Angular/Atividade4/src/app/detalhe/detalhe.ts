import { Component } from '@angular/core';
import { Produto } from '../model/produto'; 

@Component({
  imports: [],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})
export class Detalhe {
  produto: Produto = new Produto();
}
