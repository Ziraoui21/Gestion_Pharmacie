import { Router } from '@angular/router';
import { AuthUser } from 'src/app/Models/AuthUser';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  constructor(private auth : AuthServiceService, private router : Router) { }

  is_admin : boolean = this.auth.is_admin();
  user !: AuthUser;
  

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
  }

  logout(){
    this.auth.logout().subscribe((data)=>{
      if(data.status)
      {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
      }
    })
  }

}
