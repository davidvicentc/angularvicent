import { Injectable, computed, signal } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Completar el dashboard',
      completed: true,
      createdAt: new Date(),
      priority: 'high',
    },
    {
      id: 2,
      title: 'Implementar autenticación',
      completed: true,
      createdAt: new Date(),
      priority: 'high',
    },
    {
      id: 3,
      title: 'Añadir animaciones',
      completed: false,
      createdAt: new Date(),
      priority: 'medium',
    },
  ]);

  // Signals computados
  completedTodos = computed(() =>
    this.todos().filter((todo) => todo.completed)
  );
  pendingTodos = computed(() => this.todos().filter((todo) => !todo.completed));
  totalTodos = computed(() => this.todos().length);

  constructor() {
    // Cargar tareas del localStorage si existen
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      this.todos.set(parsedTodos);
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  getTodos() {
    return this.todos;
  }

  addTodo(title: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date(),
      priority,
    };

    this.todos.update((todos) => [...todos, newTodo]);
    this.saveTodos();
  }

  toggleTodo(id: number) {
    this.todos.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    this.saveTodos();
  }

  deleteTodo(id: number) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    this.saveTodos();
  }

  updateTodoPriority(id: number, priority: 'low' | 'medium' | 'high') {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
    this.saveTodos();
  }
}
