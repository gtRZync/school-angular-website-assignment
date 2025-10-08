import { Component, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../services/user';
import { ThemeService, ThemeChoice } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly cart = inject(CartService);
  private readonly user = inject(User);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);

  items = this.cart.items;
  cartCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  isAuthenticated(): boolean {
    return this.user.isAuthenticated();
  }

  logout() {
    this.user.logout();
    this.router.navigateByUrl('/');
  }

  setTheme(choice: ThemeChoice){
    this.theme.set(choice);
  }
}
