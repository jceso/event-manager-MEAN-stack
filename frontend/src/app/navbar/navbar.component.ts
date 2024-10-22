import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = true;

  constructor(private auth: AuthService, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.checkUserAuthentication();
  }

  checkUserAuthentication(): void {
    const currentUser = localStorage.getItem('currentUser');
  
    if (currentUser) {
      try {
        const token = JSON.parse(currentUser).token;
  
        this.auth.check(token).subscribe({
          next: (isValid: boolean) => {
            this.isAuthenticated = isValid;  // Validation checked
          },
          error: () => {  // Token is invalid
            this.isAuthenticated = false;
            localStorage.removeItem('currentUser');
            this.cd.detectChanges();
          }
        });
      } catch (error) {
        this.isAuthenticated = false; // No token found in currentUser
      }
    } else
      this.isAuthenticated = false; // There's no currentUser in local storage
  }
  

  logout() {
    this.auth.logout();
    this.isAuthenticated = false;
    this.router.navigate(['login']);
  }
}