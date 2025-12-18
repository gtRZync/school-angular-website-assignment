import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Header } from './components/template/header/header';
import { DefaultTemplate } from './components/template/default-template/default-template';
import { MinimalTemplate } from './components/template/minimal-template/minimal-template';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Products } from './components/products/products';
import { Cart } from './components/cart/cart';
import { AdminProducts } from './components/admin/products/products';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: DefaultTemplate, 
    children: [
      {
        path: '', 
        component: Homepage
      },
      {
        path: 'login', 
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
      ,
      {
        path: 'products',
        component: Products
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'admin/products',
        component: AdminProducts,
        canActivate: [adminGuard]
      }
    ]
  },
  
];
