import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../API/Auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router : Router, private auth : AuthServiceService){}

  canActivate(): boolean {
    if(this.auth.is_admin())
      return true;
    else
      this.router.navigate(['/main/dashboard']);
      return false;
  }
  
}
