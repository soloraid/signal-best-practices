import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TodoService } from './services/todo.service';

export const userIdResolver: ResolveFn<void> = (route, state) => {
  inject(TodoService).setUserId(route.params?.['userId']);
};
