import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { User } from '../../models/user';
import { ThumbPosition } from '@angular/material/slider/testing';

const endpoint = "http://localhost:8080/users/";
const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuth$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  check(): Observable<boolean> {
    const currentUser = localStorage.getItem('currentUser');
  
    if (currentUser) {
      const token = JSON.parse(currentUser).token;
  
      return this.http.get(endpoint + "check-login", { headers: new HttpHeaders({ 'token': token }) })
        .pipe(
          map(() => {
            this.isAuthenticatedSubject.next(true);
            return true;
          }),
          catchError((error) => {
            this.logout(); // Logout clears the local storage
            return of(false); // Return observable with 'false' as a value
          })
        );
    } else {
      this.isAuthenticatedSubject.next(false); // No token means not authenticated
      return of(false);
    }
  }
  


  login(email: string, password: string): Observable<Response> {
    return this.http.post<any>(endpoint + "login", { e: email, pw: password }, options)
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          return response;
        }),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false);
          throw error;
        })
      );
  }

  register(username: string, e: string, pw: string, pn: string): Observable<any> {
    return this.http.post<any>(endpoint + "register", { name: username, email: e, password: pw, phonenumber: pn }, options)
      .pipe(
        map((response) => {
          if (response && response.token) {
            // Set authentication status and store token
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          return response;
        }),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false); // Set to false on error
          throw error;
        })
      );
  }

  getInfo(): Observable<User> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    let user: Observable<User> = this.http.get<User>(endpoint+"user-info-endpoint", {headers: new HttpHeaders({'token': currentUser})});
    return user;
  }

  edit(username: string, e: string, pn: string) {
    return this.http.post<any>(endpoint+"edit", {name: username, email: e, phonenumber: pn}, options)
      .pipe(catchError((error) => {
        throw error;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
  }
}

export interface AuthResponse{ }