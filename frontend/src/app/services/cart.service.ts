import { Injectable, signal, inject } from '@angular/core';
import type { Product } from './products.service';
import { StorageService } from './storage.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {


  private readonly storageKey = 'cart_items';
  readonly items = signal<CartItem[]>(this.load());
  private readonly storageService = inject(StorageService);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private load(): CartItem[] {
    if (!this.isBrowser()) return [];
    try {
      const stored = this.storageService.getItem<CartItem[]>(this.storageKey);
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    if (!this.isBrowser()) return;
    try {
      this.storageService.setItem(this.storageKey, this.items());
    } catch {
      // Optional: handle quota exceeded or other storage errors
    }
  }

  add(product: Product, quantity: number = 1): void {
    const list = [...this.items()];
    const idx = list.findIndex(ci => ci.product.id === product.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], quantity: list[idx].quantity + quantity };
    } else {
      list.push({ product, quantity });
    }
    this.items.set(list);
    this.persist();
  }

  update(productId: number, quantity: number): void {
    const list = this.items()
      .map(ci => ci.product.id === productId ? { ...ci, quantity } : ci)
      .filter(ci => ci.quantity > 0);
    this.items.set(list);
    this.persist();
  }

  remove(productId: number): void {
    this.items.set(this.items().filter(ci => ci.product.id !== productId));
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }

  total(): number {
    return this.items().reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
  }
}
