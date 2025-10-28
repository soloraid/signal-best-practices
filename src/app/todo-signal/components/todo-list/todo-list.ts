import { Component, inject, input, InputSignalWithTransform, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoModel } from '../../models/todo';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatDivider, MatList, MatListItem, MatListItemLine, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatGridList,
    MatGridTile,
    MatListItem,
    MatDivider,
    MatNavList,
    RouterLink,
    NgClass,
    MatList,
    MatListItemTitle,
    MatListItemLine,
    MatProgressSpinnerModule,
    MatButton
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  private todoService = inject(TodoService);
  private userService: UserService = inject(UserService);
  userId: InputSignalWithTransform<number, string> = input(null, {
    transform: (value: string) => value ? +value : null,
  });

  userList: Signal<User[]> = this.userService.users;
  isUsersLoading: Signal<boolean> = this.userService.isLoading;
  usersError: Signal<Error> = this.userService.error;
  todos: Signal<TodoModel[]> = this.todoService.todos;
  isTodosLoading: Signal<boolean> = this.todoService.isTodosLoading;
  todosError: Signal<Error> = this.todoService.todosError;

  selectedUser: WritableSignal<User> = linkedSignal<{ userId: number; users: User[] }, User>({
    source: () => ({userId: this.userId(), users: this.userList()}),
    computation: (source) => {
      if (source.userId && source?.users?.length > 0) {
        return source.users.find(user => user.id === +source.userId);
      }
      return null;
    },
  });

  allTodos(): void {
    this.selectedUser.set(null);
    this.todoService.setUserId(null);
  }

  completeTodo(todo: TodoModel): void {
    this.todoService.updateTodo(todo, true);
  }

  deleteTodo(todo: TodoModel): void {
    this.todoService.deleteTodo(todo.id);
  }

  addTodo(): void {
    this.todoService.addNewTodo('add new todo', this.userId());
  }
}
