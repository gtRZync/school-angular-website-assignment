import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  public tokenSubject: BehaviorSubject<String>;


  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tokenSubject = new BehaviorSubject<String>('');
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSubject = new BehaviorSubject<String>(
        JSON.parse(<string>localStorage.getItem('token'))
      );
    }
   }

  public get token(): String {
    return this.tokenSubject.value;
  }

  setToken(token: string){
    localStorage.setItem('token', JSON.stringify(token));
    this.tokenSubject.next(token);
  }

  login(username: string, password: string) {
    return this.http.post('https://fakestoreapi.com/auth/login', { username, password });
  }

  signin(username: string, password: string, email: string) {
    return this.http.post('https://fakestoreapi.com/users', { username, password, email });
  }

  getAll() {
    return this.http.get('https://fakestoreapi.com/users');
  }

  logout(){
    this.setToken('');
    this.router.navigate(['/']);
  }
}
