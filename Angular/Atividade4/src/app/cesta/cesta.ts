import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. Certifique-se de importar aqui

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule], // 2. E incluir na lista de imports!
  templateUrl: './cesta.html',
  styleUrl: './cesta.css'
})
export class CestaComponent {
  
  constructor() {
    var total = 0
    var quantidade = 0
    var lista

  }
  calcularTotal() {
    this.total = this.list.reduce((acc, item) => acc + item.precoTotal, 0);
  }
}