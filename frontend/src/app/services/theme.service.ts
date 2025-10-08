import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeChoice = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'ui.theme.choice';

  private readonly storageService = inject(StorageService);
  current = signal<ThemeChoice>(this.readInitialChoice());

  constructor() {
    if (this.isBrowser()) {
      this.apply(this.current());
    }
  }

  set(choice: ThemeChoice) {
    this.current.set(choice);
    if (this.isBrowser()) {
      this.storageService.setItem(ThemeService.STORAGE_KEY, choice);
    }
    this.apply(choice);
  }

  private apply(choice: ThemeChoice) {
    if (!this.isBrowser()) return;

    const html = document.documentElement;
    html.setAttribute('data-theme', choice);
  }

  private readInitialChoice(): ThemeChoice {
    if (!this.isBrowser()) return 'dark';
    const saved = this.storageService.getItem(ThemeService.STORAGE_KEY) as ThemeChoice | null;
    return saved ?? 'dark';
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
