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
  list = [
    { produto: 'Relógio Relogio Executive', quantidade: 1, precoTotal: 4500.00 },
    { produto: 'Relógio Speed Sport', quantidade: 2, precoTotal: 2400.00 }
  ];
  vazia: boolean = false;
  valorTotal: number = 6900.00;
}