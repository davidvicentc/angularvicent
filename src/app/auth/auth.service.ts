import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSignal = signal<boolean>(false);
  private userSignal = signal<string | null>(null);

  constructor(private router: Router) {
    // Verificar si hay una sesión guardada
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    if (savedAuth === 'true' && savedUser) {
      this.isAuthenticatedSignal.set(true);
      this.userSignal.set(savedUser);
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@admin.com' && password === '123456') {
      this.isAuthenticatedSignal.set(true);
      this.userSignal.set(email);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', email);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticatedSignal.set(false);
    this.userSignal.set(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.isAuthenticatedSignal;
  }

  getUser() {
    return this.userSignal;
  }
}
