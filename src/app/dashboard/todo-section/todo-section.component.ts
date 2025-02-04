import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { trigger, transition, style, animate } from '@angular/animations';

type Priority = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-todo-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
        <div class="text-sm text-gray-600">
          {{ todoService.completedTodos().length }}/{{
            todoService.totalTodos()
          }}
          completadas
        </div>
      </div>

      <!-- Formulario para agregar tarea -->
      <div class="flex gap-2 mb-6">
        <input
          #newTodo
          type="text"
          class="input-primary flex-1"
          placeholder="Agregar nueva tarea..."
          (keyup.enter)="addTodo(newTodo)"
        />
        <select
          #priority
          class="input-primary w-32"
          (change)="onPriorityChange(priority.value)"
        >
          <option value="low">Baja</option>
          <option value="medium" selected>Media</option>
          <option value="high">Alta</option>
        </select>
        <button class="btn-primary" (click)="addTodo(newTodo)">Agregar</button>
      </div>

      <!-- Lista de tareas -->
      <div class="space-y-3">
        @for (todo of todoService.getTodos()(); track todo.id) {
        <div
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-200"
          [class.opacity-60]="todo.completed"
          [@todoAnimation]
        >
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="todoService.toggleTodo(todo.id)"
            class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span
            class="flex-1"
            [class.line-through]="todo.completed"
            [class.text-gray-500]="todo.completed"
          >
            {{ todo.title }}
          </span>
          <span
            class="px-2 py-1 text-xs rounded-full"
            [class]="getPriorityClass(todo.priority)"
          >
            {{ todo.priority }}
          </span>
          <button
            (click)="todoService.deleteTodo(todo.id)"
            class="text-red-500 hover:text-red-700"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        } @if (!todoService.totalTodos()) {
        <div class="text-center text-gray-500 py-4">
          No hay tareas registradas
        </div>
        }
      </div>
    </div>
  `,
  animations: [
    trigger('todoAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class TodoSectionComponent {
  todoService = inject(TodoService);
  selectedPriority: Priority = 'medium';

  onPriorityChange(value: string) {
    if (this.isPriority(value)) {
      this.selectedPriority = value;
    }
  }

  private isPriority(value: string): value is Priority {
    return ['low', 'medium', 'high'].includes(value);
  }

  addTodo(input: HTMLInputElement) {
    if (input.value.trim()) {
      this.todoService.addTodo(input.value.trim(), this.selectedPriority);
      input.value = '';
    }
  }

  getPriorityClass(priority: Priority): string {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return classes[priority];
  }
}
