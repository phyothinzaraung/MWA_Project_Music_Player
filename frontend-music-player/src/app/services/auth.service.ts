import { Injectable, inject, signal } from '@angular/core';
import { IToken } from '../interfaces/IToken.interface';
import { IResponse } from '../interfaces/IResponse.interface';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/IUser.interface';

export const INITIAL_STATE = {
  _id: '', 
  fullname: '',
  email: '',
  jwt: ''
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  state_signal = signal<{
    jwt: string
  } & IToken>(INITIAL_STATE);

  #http = inject(HttpClient);

  signin(data: {email: string, password: string}) {
    return this.#http.post<IResponse<string>>('http://localhost:3000/auth/signin', data);
   }

  signup(data: IUser) {
    return this.#http.post<IResponse<string>>("http://localhost:3000/auth/signup", data);
  }
}
