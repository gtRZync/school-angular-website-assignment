import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../services/user';
import { CartService } from '../../services/cart.service';
import { API_CONFIG } from '../../config/api.config';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  signupForm: FormGroup;
  loading = false;
  error: string | null = null;

  private readonly user = inject(User);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly apiUrl = API_CONFIG.baseUrl;

  constructor() {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password === confirm ? null : { mismatch: true };
  };

  onSubmit() {
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    const { username, email, password } = this.signupForm.value;
    this.user.register(this.apiUrl, {
      name: username,
      email,
      password,
      password_confirmation: password
    }).subscribe({
      next: () => {
        this.loading = false;
        // Initialize cart after registration
        this.cart.initialize();
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
