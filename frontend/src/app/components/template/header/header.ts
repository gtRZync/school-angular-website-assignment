import { Component, computed, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../services/user';
import { ThemeService, ThemeChoice } from '../../../services/theme.service';
import { API_CONFIG } from '../../../config/api.config';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private readonly cart = inject(CartService);
  private readonly user = inject(User);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly apiUrl = API_CONFIG.baseUrl;

  items = this.cart.items;
  cartCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  ngOnInit(): void {
    // Initialize cart when component loads
    this.cart.initialize();
  }

  isAuthenticated(): boolean {
    return this.user.isAuthenticated();
  }

  isAdmin(): boolean {
    const token = this.user.token;
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch (e) {
      return false;
    }
  }

  logout() {
    const result = this.user.logout(this.apiUrl);
    if (result) {
      result.subscribe({
        next: () => {
          this.cart.clear();
          this.router.navigateByUrl('/');
        },
        error: () => {
          // Even if logout fails, clear cart and navigate
          this.cart.clear();
          this.router.navigateByUrl('/');
        }
      });
    } else {
      this.cart.clear();
      this.router.navigateByUrl('/');
    }
  }

  setTheme(choice: ThemeChoice){
    this.theme.set(choice);
  }
}
