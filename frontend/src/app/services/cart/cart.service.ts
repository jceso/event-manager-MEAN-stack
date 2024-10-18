import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Sale } from '../../models/sale';
import { User } from '../../models/user';


const endpoint = "http://localhost:8080/sales/";
const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface SaleDetails {
  event_name: string,
  event_date: string,
  place_name: string,
  ticket_type: string,
  quantity: number
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  constructor(private http: HttpClient) { }

  saveSale(eventId: string, type: string) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const headers = new HttpHeaders({ 'token': currentUser, 'event_id': eventId, 'type': type });
    return this.http.post<User>(endpoint + "save", {}, { headers });
  }

  getCart(): Observable<SaleDetails[]> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    return this.http.get<SaleDetails[]>(endpoint+"cart", {headers: new HttpHeaders({'token': currentUser})});
  }
}