import { AuthServiceService } from './../API/Auth/auth-service.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private router : Router, private auth : AuthServiceService){}

  canActivate(): boolean {
    if(!this.auth.is_logged())
      return true;
    else
      this.router.navigate(['/main']);
      return false;
  }
  
}
