import { GlobalResponse } from './global-response';

export interface TodoModel {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse extends GlobalResponse {
  todos: TodoModel[];
}


export interface TodoDeleteResponse extends TodoModel {
  isDeleted: boolean;
  deletedOn: Date;
}
