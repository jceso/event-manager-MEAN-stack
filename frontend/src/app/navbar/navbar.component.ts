import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router){ }
  
  ngOnInit(): void {
    this.currentUserExists();
  }

  currentUserExists(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser)
      return true; // User is logged in and token is valid
    return false; // No user is logged in
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}

