import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EventService } from '../../services/event/event.service';
import { PlaceService } from '../../services/place/place.service';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { Event } from "../../models/event";
import { Place } from '../../models/place';
import { User } from '../../models/user';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})

export class EventsComponent implements OnInit {
  userInfo: User = {
    _id: '',
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    points: 0,
    role: 'USER'
  };
  listOfPlaces: Place[] = [];
  listOfEvents: Event[] = [];
  prize: number = 10;

  constructor(private eventService: EventService, private placeService: PlaceService, private cartService: CartService, private auth: AuthService, private router: Router){
  }
  ngOnInit(): void {
    this.getAllPlaces();
    this.getAllEvents();
    this.getInfo();
    this.points();
  }

  points(): void{
    if(this.prize <= 1){
      this.prize = 1;
    }
  }
  
  getInfo(): void {
    this.auth.getInfo().subscribe({
      next: (data: User) => {
        this.userInfo = data;
        this.prize = this.prize - data.points;
        if(this.prize < 1){
          this.prize = 1;
        }
      },
      error: (err: any) => { }
    });
  }

  // Details about the event
  infoEvent(eventId: string): void {
    this.router.navigate(['event-info', eventId]);
  }
  
  currentUserExists(): boolean {
    return localStorage.getItem('currentUser') == null;
  }

  getAllPlaces(){
    this.placeService.getAllPlaces().subscribe({
      next: (data) => {
        this.listOfPlaces = data;
      },
      error: err => {
        alert("ERROR - Places not found!");
      }
    });
  }
  
  getAllEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.listOfEvents = data;
  
        for (let i = 0; this.listOfEvents[i] != null; i++) {
          this.listOfEvents[i].date = this.listOfEvents[i].date.split("T", 2)[0];
  
          for (let j = 0; this.listOfPlaces[j] != null; j++) {
            if (this.listOfEvents[i].place_id == this.listOfPlaces[j]._id)
              this.listOfEvents[i].place_id = this.listOfPlaces[j].name;
          }
        }

        this.sortByDateSoonestFirst();
      },
      error: (err) => {
        alert("ERROR - Events not found!");
      }
    });
  }

  // Sorting

  sortAlphabetically(): void {
    this.listOfEvents.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  sortReverse(): void {
    this.listOfEvents.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }

  sortByPlace(): void {
    this.listOfEvents.sort((a, b) => {
      const placeComparison = a.place_id.localeCompare(b.place_id);
      if (placeComparison === 0) {
        return a.name.localeCompare(b.name);
      } else {
        return placeComparison;
      }
    });
  }

  sortReversePlace(): void {
    this.listOfEvents.sort((a, b) => {
      const placeComparison = b.place_id.localeCompare(a.place_id);
      if (placeComparison === 0) {
        return a.name.localeCompare(b.name);
      } else {
        return placeComparison;
      }
    });
  }

  sortByDateSoonestFirst(): void {
    this.listOfEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  sortByDateLatestFirst(): void {
    this.listOfEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }
}