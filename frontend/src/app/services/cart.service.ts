import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import type { Product } from './products.service';
import { User } from './user';
import { API_CONFIG } from '../config/api.config';

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
}

interface CartItemResponse {
  id: number;
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly user = inject(User);
  private readonly apiUrl = API_CONFIG.baseUrl;

  readonly items = signal<CartItem[]>([]);
  private initialized = false;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Initialize cart from API if user is authenticated
   */
  initialize(): void {
    if (this.user.isAuthenticated() && !this.initialized) {
      this.loadFromApi().subscribe({
        next: (items) => {
          this.items.set(items);
          this.initialized = true;
        },
        error: () => {
          // If API fails, keep empty cart
          this.items.set([]);
        }
      });
    }
  }

  /**
   * Load cart items from API
   */
  private loadFromApi(): Observable<CartItem[]> {
    return this.http.get<CartItemResponse[]>(`${this.apiUrl}/cart`).pipe(
      map((response) => response.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity
      }))),
      catchError(() => of([]))
    );
  }

  /**
   * Add product to cart
   */
  add(product: Product, quantity: number = 1): void {
    if (!this.user.isAuthenticated()) {
      // Fallback to local storage if not authenticated
      const list = [...this.items()];
      const idx = list.findIndex(ci => ci.product.id === product.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], quantity: list[idx].quantity + quantity };
      } else {
        list.push({ product, quantity });
      }
      this.items.set(list);
      return;
    }

    // Use API if authenticated
    this.http.post<{ item: CartItemResponse }>(`${this.apiUrl}/cart/add`, {
      product_id: product.id,
      quantity: quantity
    }).subscribe({
      next: (response) => {
        const list = [...this.items()];
        const idx = list.findIndex(ci => ci.product.id === product.id);
        const newItem = {
          id: response.item.id,
          product: response.item.product,
          quantity: response.item.quantity
        };
        if (idx >= 0) {
          list[idx] = newItem;
        } else {
          list.push(newItem);
        }
        this.items.set(list);
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
      }
    });
  }

  /**
   * Update cart item quantity
   */
  update(productId: number, quantity: number): void {
    if (!this.user.isAuthenticated()) {
      // Fallback to local storage if not authenticated
      const list = this.items()
        .map(ci => ci.product.id === productId ? { ...ci, quantity } : ci)
        .filter(ci => ci.quantity > 0);
      this.items.set(list);
      return;
    }

    // Find the cart item ID
    const cartItem = this.items().find(ci => ci.product.id === productId);
    if (!cartItem || !cartItem.id) {
      return;
    }

    // Use API if authenticated
    this.http.put<{ item: CartItemResponse }>(`${this.apiUrl}/cart/${cartItem.id}`, {
      quantity: quantity
    }).subscribe({
      next: (response) => {
        if (quantity === 0) {
          this.items.set(this.items().filter(ci => ci.product.id !== productId));
        } else {
          const list = this.items().map(ci =>
            ci.product.id === productId
              ? { id: response.item.id, product: response.item.product, quantity: response.item.quantity }
              : ci
          );
          this.items.set(list);
        }
      },
      error: (err) => {
        console.error('Failed to update cart:', err);
      }
    });
  }

  /**
   * Remove item from cart
   */
  remove(productId: number): void {
    if (!this.user.isAuthenticated()) {
      // Fallback to local storage if not authenticated
      this.items.set(this.items().filter(ci => ci.product.id !== productId));
      return;
    }

    // Find the cart item ID
    const cartItem = this.items().find(ci => ci.product.id === productId);
    if (!cartItem || !cartItem.id) {
      return;
    }

    // Use API if authenticated
    this.http.delete(`${this.apiUrl}/cart/${cartItem.id}`).subscribe({
      next: () => {
        this.items.set(this.items().filter(ci => ci.product.id !== productId));
      },
      error: (err) => {
        console.error('Failed to remove from cart:', err);
      }
    });
  }

  /**
   * Clear all cart items
   */
  clear(): void {
    if (!this.user.isAuthenticated()) {
      // Fallback to local storage if not authenticated
      this.items.set([]);
      return;
    }

    // Use API if authenticated
    this.http.delete(`${this.apiUrl}/cart`).subscribe({
      next: () => {
        this.items.set([]);
      },
      error: (err) => {
        console.error('Failed to clear cart:', err);
      }
    });
  }

  /**
   * Calculate total price
   */
  total(): number {
    return this.items().reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
  }
}
