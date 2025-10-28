import { Routes } from '@angular/router';
import { userIdResolver } from './user-id-resolver';


export default [
  {
    path: 'list',
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoList),
  },
  {
    path: 'list/:userId',
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoList),
    resolve: [userIdResolver],
  },
] satisfies Routes;
