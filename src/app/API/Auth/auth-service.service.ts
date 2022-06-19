import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from 'src/app/Models/AuthUser';
import { User } from 'src/app/Models/User';
import { ResponseAPI } from 'src/app/Response/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http : HttpClient) { }

  login(email : string, password : string)
  {
    const data = {
      email : email,
      password : password
    };

    return this.http.post<AuthUser>('http://127.0.0.1:8000/api/auth/login',data);
  }

  editUser(user : AuthUser){

    let userAuth : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/auth/edit',user,{
      headers : new HttpHeaders({Authorization : `Bearer ${userAuth.token}`})
    });
  }

  is_logged() : boolean
  {
      return !!localStorage.getItem('user');
  }

  is_admin() : boolean{
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    if(user.role == 'admin')
      return true;
    else
      return false;
  }

  logout() {

    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<ResponseAPI>('http://127.0.0.1:8000/api/auth/logout',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
