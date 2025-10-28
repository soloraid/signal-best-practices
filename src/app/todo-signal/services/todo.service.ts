// https://dummyjson.com/docs/todos
import { computed, inject, Injectable, Injector, resource, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { TodoDeleteResponse, TodoModel, TodosResponse } from '../models/todo';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http: HttpClient = inject(HttpClient);
  private _userId: WritableSignal<number> = signal<number>(null);
  private todosResource = resource<TodosResponse, { userId: number }>({
    params: () => ({userId: this.userId()}),
    loader: ({params}) => fetch(`${environment.baseUrl}/todos${params.userId ? `/user/${params.userId}` : ''}`)
      .then(res => res.json()),
  });

  get userId(): Signal<number> {
    return this._userId.asReadonly();
  }

  setUserId(userId: number): void {
    this._userId.set(userId);
  }

  get todos(): Signal<TodoModel[]> {
    return computed(() => this.todosResource?.value()?.todos);
  }

  get isTodosLoading(): Signal<boolean> {
    return this.todosResource.isLoading;
  }

  get todosError(): Signal<Error> {
    return this.todosResource.error;
  }

  addNewTodo(todo: string, userId: number): void {
    this.http.post<TodoModel>(`${environment.baseUrl}/todos/add`, {
      todo,
      completed: false,
      userId,
    }).subscribe({
      next: (res) => this.todosResource.update(value => {
        return {
          ...value,
          todos: [...value.todos, res],
        }
      }),
      // next: () => this.todosResource.reload(),
    })
  }

  updateTodo(todo: TodoModel, completed: boolean): void {
    this.http.patch<TodoModel>(`${environment.baseUrl}/todos/${todo.id}`, {completed}).subscribe({
      next: () => this.todosResource.update(value => {
       let updateValues = [...value.todos];
       const index = updateValues.findIndex(t => t.id === todo.id);
       updateValues[index] = {
         ...todo,
         completed
       }
       return {
         ...value,
         todos: [...updateValues],
       }
      }),
      // next: () => this.todosResource.reload(),
    })
  }

  deleteTodo(id: number): void {
    this.http.delete<TodoDeleteResponse>(`${environment.baseUrl}/todos/${id}`).subscribe({
      next: () => this.todosResource.update(value => {
        let updateValues = [...value.todos];
        const index = updateValues.findIndex(t => t.id === id);
        updateValues.splice(index, 1);
        return {
          ...value,
          todos: [...updateValues],
        }
      }),
      // next: () => this.todosResource.reload(),
    });
  }

}
