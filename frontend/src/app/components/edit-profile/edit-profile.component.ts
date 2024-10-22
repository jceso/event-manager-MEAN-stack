import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userInfo: User = {
    _id: '',
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    points: 0,
    role: 'USER'
  };

  ePattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  nPattern = /^(\+?[0-9]{9,15})$/;

  name: string = "";
  email: string = "";
  number: string = "";
  

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.auth.getInfo().subscribe({
      next: (data: User) => {
        this.userInfo = data;
      }, error: (err: any) => { }
    });
  }

  editUser() {
    this.auth.edit(this.name, this.email, this.number).subscribe({
      next: (user : any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['profile']);
        }
      }, error: (error: any) => {
        if (error.status === 404)
          alert('No user found');
        else  // Other error cases
          alert('An error occurred during registration.');
    }});
  }

  validate() {
    this.name = (document.getElementById("username") as HTMLInputElement).value;
    this.email = (document.getElementById("email") as HTMLInputElement).value;
    this.number = (document.getElementById("phonenumber") as HTMLInputElement).value;  
    
    if (this.name != "") {
      if (this.number != "" && this.nPattern.test(this.number))
        this.editUser();
      else if (this.number != "")
        alert("Phone number must be between 9-15 digits and can optionally start with a +.");
      else
        this.editUser();
    } else
      alert("Name is required!");
  }

}
