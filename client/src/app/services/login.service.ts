import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private httpClient: HttpClient) {}

  // Função de login
  login(username: string, password: string): Observable<any> {
    console.log(username, password);
    return this.httpClient
      .post<LoginResponse>(
        `${this.baseUrl}/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.username);
        })
      );
  }

  // Função de signup
  signup(username: string, email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/signup`, {
      username,
      email,
      password,
    });
  }
}
