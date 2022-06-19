import { AuthUser } from 'src/app/Models/AuthUser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user !:AuthUser;

  constructor() { }

  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
  }

}
