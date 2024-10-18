import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from "../../models/event";

const endpoint = "http://localhost:8080/events/";
const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface EventDetails {
  name: string;
  date: string;
  place: string;
  t_types: {
    name: string;
    price: number;
  }[];
  details: string;
}

export interface TicketDetails {
  _id: string,
  name: string;
  date: string;
  place_id: string;
  t_types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(endpoint + "showAll");
  }

  getBoughtEvents(): Observable<Event[]> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    return this.http.get<Event[]>(endpoint + "showSale", {headers: new HttpHeaders({'token': currentUser})});
  }

  //Infos for ticket page
  getEventPlaces(eventIds: string[]): Observable<TicketDetails[]> {
    return this.http.post<TicketDetails[]>(endpoint + "getEventPlaces", { eventIds }, options);
  }

  //Infos for the detailed event page 
  eventDetailed(eventId: string) : Observable<EventDetails> {
    return this.http.post<EventDetails>(endpoint + "eventDetails", { eventId }, options);
  }
}
