import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuth: boolean = false;

  constructor(private auth: AuthService, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Subscribe to auth status observable
    this.auth.isAuth$.subscribe(isAuthenticated => {
      this.isAuth = isAuthenticated;
    });

    this.auth.check().subscribe();
  }

  

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}