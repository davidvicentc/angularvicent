import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { TodoSectionComponent } from './todo-section/todo-section.component';

interface DashboardCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TodoSectionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  user = this.authService.getUser();
  cards = signal<DashboardCard[]>([]);

  ngOnInit() {
    // Simulación de datos para el dashboard
    this.cards.set([
      {
        title: 'Usuarios Activos',
        value: 1234,
        icon: 'users',
        color: 'bg-blue-500',
      },
      {
        title: 'Ingresos Mensuales',
        value: 45678,
        icon: 'dollar',
        color: 'bg-green-500',
      },
      {
        title: 'Proyectos',
        value: 89,
        icon: 'folder',
        color: 'bg-purple-500',
      },
      {
        title: 'Tareas Pendientes',
        value: 15,
        icon: 'tasks',
        color: 'bg-red-500',
      },
    ]);
  }

  logout() {
    this.authService.logout();
  }
}
