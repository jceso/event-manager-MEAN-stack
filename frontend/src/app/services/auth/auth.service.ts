import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { User } from '../../models/user';

const endpoint = "http://localhost:8080/users/";
const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password:string): Observable<Response>{
    return this.http.post<Response>(endpoint+"login", {e: email, pw: password}, options)
    .pipe(catchError((error) => {
      throw error;
    }));
  }

  register(username: string, e: string, pw: string, pn: string) {
    return this.http.post<any>(endpoint+"register", {name: username, email: e, password: pw, phonenumber: pn}, options)
      .pipe(catchError((error) => {
        throw error;
      }));
  }

  getInfo(): Observable<User> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    let ciao:Observable<User> = this.http.get<User>(endpoint+"user-info-endpoint", {headers: new HttpHeaders({'token': currentUser})});
    console.log(ciao);
    return ciao;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}

export interface AuthResponse{ }