import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'todo-observable/list', pathMatch: 'full'},
  {
    path: 'signal/todo',
    loadChildren: () => import('./todo-signal/todo.routes'),
  },
  {
    path: 'observable/todo',
    loadChildren: () => import('./todo-observable/todo.routes'),
  },
];
