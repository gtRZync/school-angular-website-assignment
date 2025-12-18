import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  private readonly cart = inject(CartService);

  items = this.cart.items;
  total = computed(() => this.cart.total());

  ngOnInit(): void {
    // Initialize cart when component loads
    this.cart.initialize();
  }

  remove(id: number) {
    this.cart.remove(id);
  }

  updateQty(id: number, qty: number) {
    const q = Math.max(0, Math.floor(qty));
    this.cart.update(id, q);
  }

  checkout() {
    alert('Commande validée (demo).');
    this.cart.clear();
  }
}


