import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { StorageService } from './storage.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse { 
  token: string;
}

@Injectable({
  providedIn: 'root' //? make available direct without needing a NgModule
})
export class User {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'auth_token';
  private readonly storageService = inject(StorageService)

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  get token(): string | null {
    if (!this.isBrowser()) return null;
    return this.storageService.getItem(this.tokenKey);
  }

  set token(value: string | null) {
    if (!this.isBrowser()) return;
    if (value) {
      this.storageService.setItem(this.tokenKey, value);
    } else {
      this.storageService.removeItem(this.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  login(apiUrl: string, payload: LoginPayload): Observable<void> {
    return this.http.post<AuthResponse>(`${apiUrl}/login`, payload).pipe(
      tap(res => this.token = res.token),
      map(() => void 0)
    );
  }

  register(apiUrl: string, payload: RegisterPayload): Observable<void> {
    return this.http.post<AuthResponse>(`${apiUrl}/register`, payload).pipe(
      tap(res => this.token = res.token),
      map(() => void 0)
    );
  }

  logout(): void {
    this.token = null;
  }
}
