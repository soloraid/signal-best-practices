import { Component, inject, Input } from '@angular/core';
import { User } from '../../../todo-signal/models/user';
import { BehaviorSubject, combineLatest, filter, Observable, of, switchMap, tap, zip } from 'rxjs';
import { UserService } from '../../user.service';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatList, MatListItem, MatListItemLine, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { TodoModel } from '../../../todo-signal/models/todo';
import { TodoService } from '../../todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatButton,
    MatDivider,
    MatGridList,
    MatGridTile,
    MatList,
    MatListItem,
    MatListItemLine,
    MatListItemTitle,
    MatNavList,
    MatProgressSpinner,
    RouterLink,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  private userService: UserService = inject(UserService);
  private todoService: TodoService = inject(TodoService);
  private _userId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  @Input()
  get userId(): Observable<number> {
    return this._userId.asObservable();
  }
  set userId(value: string | number) {
    this._userId.next(value ? +value : null);
    if (value) {
      this.todoService.getUserTodos(+value);
    } else {
      this.todoService.getAllTodos();
    }
  };

  userList$: Observable<User[]> = this.userService.users$;
  isUsersLoading$: Observable<boolean> = this.userService.isLoading$;
  usersError$: Observable<Error> = this.userService.error$;

  isTodosLoading$: Observable<boolean> = this.todoService.todosLoading$
  todosError$: Observable<Error> = this.todoService.todoError$;
  todos$: Observable<TodoModel[]> = this.todoService.todos$;

  selectedUser: User;

  constructor() {
    this.userService.getUsers();
    this.userList$.pipe(
      filter(users => users?.length > 0),
      switchMap(users => zip(this.userId, of(users))),
      tap(res => {
        if(res[0] != null) {
          this.selectedUser = res[1].find(user => user.id === res[0]);
        }
      })
    ).subscribe(console.log);
  }

  allTodos(): void {
    this.userId = null;
  }

  completeTodo(todo: TodoModel): void {
    this.todoService.updateTodo(todo, true);
  }

  deleteTodo(todo: TodoModel): void {
    this.todoService.deleteTodo(todo.id);
  }

  addTodo(): void {
    this.todoService.addNewTodo('add new todo', this._userId.getValue());
  }

  updateSelectUser(user: User): void {
    this.selectedUser = {...user};
  }
}
