import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../services/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  private readonly user = inject(User);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.user.login(this.apiUrl, this.loginForm.value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Login failed';
        }
      });
  }
}
