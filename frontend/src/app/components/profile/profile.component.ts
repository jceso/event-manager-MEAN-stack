import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo: User = {
    _id: '',
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    points: 0,
    role: 'USER'
  };
  isAdm: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.auth.getInfo().subscribe({
      next: (data: User) => {
        this.userInfo = data;
        this.isAdm = (this.userInfo.role == 'ADMIN')
      }, error: (err: any) => { }
    });
  }

  numSaved(): boolean {
    return this.userInfo.phonenumber != null;
  }

  goToAdminWebsite(): void {
    window.location.href = 'http://localhost:8080';
  }
}
