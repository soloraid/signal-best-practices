import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserResponse } from '../todo-signal/models/user';
import { TodosResponse } from '../todo-signal/models/todo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _error: BehaviorSubject<Error> = new BehaviorSubject<Error>(null);

  getUsers(): void {
    this._isLoading.next(false);
    this.http.get<UserResponse>(`${environment.baseUrl}/users`).subscribe({
      next: data => this._users.next(data.users),
      error: error => this._error.next(error),
      complete: () => this._isLoading.next(false),
    });
  }

  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  get error$(): Observable<Error> {
    return this._error.asObservable();
  }
}
