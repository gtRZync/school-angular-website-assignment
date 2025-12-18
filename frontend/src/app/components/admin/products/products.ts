import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService, Product } from '../../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class AdminProducts implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  products: Product[] = [];
  loading = false;
  editingProduct: Product | null = null;
  showForm = false;
  error: string | null = null;
  success: string | null = null;

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
    category: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  });

  categories = ['Running', 'Casual', 'Basketball'];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.listProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openCreateForm(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  openEditForm(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description || '',
      category: product.category,
      image: product.image
    });
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingProduct = null;
    this.productForm.reset();
    this.error = null;
    this.success = null;
  }

  saveProduct(): void {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Convert form values, removing null values and converting to proper types
    const formValue = this.productForm.value;
    const productData: Partial<Product> = {
      title: formValue.title ?? undefined,
      price: formValue.price ?? undefined,
      description: formValue.description ?? undefined,
      category: formValue.category ?? undefined,
      image: formValue.image ?? undefined,
    };

    if (this.editingProduct) {
      // Update existing product
      this.productsService.updateProduct(this.editingProduct.id, productData).subscribe({
        next: () => {
          this.success = 'Product updated successfully';
          this.loadProducts();
          this.cancelForm();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to update product';
          this.loading = false;
        }
      });
    } else {
      // Create new product - ensure all required fields are present
      const createData: Omit<Product, 'id'> = {
        title: productData.title!,
        price: productData.price!,
        description: productData.description || '',
        category: productData.category!,
        image: productData.image!,
      };
      this.productsService.createProduct(createData).subscribe({
        next: () => {
          this.success = 'Product created successfully';
          this.loadProducts();
          this.cancelForm();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to create product';
          this.loading = false;
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.title}"?`)) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.success = 'Product deleted successfully';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete product';
        this.loading = false;
      }
    });
  }
}

