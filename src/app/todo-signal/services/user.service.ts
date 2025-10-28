import { computed, Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environment';
import { User, UserResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersResource = httpResource<UserResponse>(() => ({
    url: `${environment.baseUrl}/users`,
    method: 'GET'
  }));

  get users(): Signal<User[]> {
    return computed(() => this.usersResource?.value()?.users);
  }

  get isLoading(): Signal<boolean> {
    return this.usersResource.isLoading;
  }

  get error(): Signal<Error> {
    return this.usersResource.error;
  }
}
