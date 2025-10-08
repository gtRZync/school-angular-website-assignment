import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);

  products: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.productsService.listProducts().subscribe({
      next: (items) => {
        this.products = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }
}


