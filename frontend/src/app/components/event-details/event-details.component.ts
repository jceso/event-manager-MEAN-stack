import { Component, OnInit } from '@angular/core';

import { EventService, EventDetails } from '../../services/event/event.service';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})

export class EventDetailsComponent implements OnInit {
  event: EventDetails = {
    name: '',
    date: '',
    place: '',
    t_types: [],
    details: ''
  };
  eventId: string = '';

  constructor(private route: ActivatedRoute, private eventService: EventService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.eventId = params.get('id') || '';
        
        this.eventService.eventDetailed(this.eventId).subscribe({
          next: (data: EventDetails) => {
            this.event = data;
            this.event.date = this.event.date.split('T', 2)[0];
          }, error: () => {
            alert("ERROR - Event not found!");
          }
        });
      }, error: () => {
        alert("ERROR - ID not found!");
      }
    });
  }

  purchase(typeName: string): void {
    if (localStorage.getItem('currentUser') == null) {
      alert("There's no user connected, please login!");
      return;
    }

    this.cartService.saveSale(this.eventId, typeName).subscribe({
      next: (user) => {
        alert(`You bought the event, so you now have ${user.points} points on this account!`);
        this.router.navigate(['cart']);
      }, error: (err: any) => {
        alert("An error occurred while purchasing the event");
      }
    });
  }
}