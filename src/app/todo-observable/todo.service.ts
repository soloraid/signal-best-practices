import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoDeleteResponse, TodoModel, TodosResponse } from '../todo-signal/models/todo';
import { environment } from '../../environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http: HttpClient = inject(HttpClient);
  private _todos$: BehaviorSubject<TodoModel[]> = new BehaviorSubject<TodoModel[]>([]);
  private _todoError$: BehaviorSubject<Error> = new BehaviorSubject<Error>(null);
  private _todosLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  get todos$(): Observable<TodoModel[]> {
    return this._todos$.asObservable();
  }

  get todoError$(): Observable<Error> {
    return this._todoError$.asObservable();
  }
  get todosLoading$(): Observable<boolean> {
    return this._todosLoading$.asObservable();
  }

  getUserTodos(userId: number): void {
    this._todosLoading$.next(true);
    this.http.get<TodosResponse>(`${environment.baseUrl}/todos/user/${userId}`).subscribe({
      next: data => this._todos$.next(data.todos),
      error: error => this._todoError$.error(error),
      complete: () => this._todosLoading$.next(false),
    });
  }

  getAllTodos(): void {
    this._todosLoading$.next(true);
    this.http.get<TodosResponse>(`${environment.baseUrl}/todos`).subscribe({
      next: data => this._todos$.next(data.todos),
      error: error => this._todoError$.error(error),
      complete: () => this._todosLoading$.next(false),
    });

  }

  addNewTodo(todo: string, userId: number): void {
    this.http.post<TodoModel>(`${environment.baseUrl}/todos/add`, {
      todo,
      completed: false,
      userId,
    }).subscribe({
      next: (res) => this._todos$.next([...this._todos$.getValue(), res]),
      error: error => this._todoError$.error(error),
    })
  }

  updateTodo(todo: TodoModel, completed: boolean): void {
    this.http.patch<TodoModel>(`${environment.baseUrl}/todos/${todo.id}`, {completed}).subscribe({
      next: () => {
        let updateValues = [...this._todos$.getValue()];
        const index = updateValues.findIndex(t => t.id === todo.id);
        updateValues[index] = {
          ...todo,
          completed
        }
        this._todos$.next([...updateValues]);
      },
      error: error => this._todoError$.error(error),
    })
  }

  deleteTodo(id: number): void {
    this.http.delete<TodoDeleteResponse>(`${environment.baseUrl}/todos/${id}`).subscribe({
      next: () => {
        let updateValues = [...this._todos$.getValue()];
        const index = updateValues.findIndex(t => t.id === id);
        updateValues.splice(index, 1);
        this._todos$.next([...updateValues]);
      }
    });
  }
}
