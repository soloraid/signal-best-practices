import { Routes } from '@angular/router';


export default [
  {
    path: 'list',
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoList),
  },
  {
    path: 'list/:userId',
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoList),
  },
] satisfies Routes;
