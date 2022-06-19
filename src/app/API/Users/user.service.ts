import { ResponseAPI } from './../../Response/ResponseAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from 'src/app/Models/AuthUser';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http : HttpClient) { }

  users(){
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<User[]>('http://127.0.0.1:8000/api/users/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  create(newUser : User){
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/users/create',newUser,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  setAdmin(id : number) {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    const data = {
      id : id
    }

    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/users/setadmin',data,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  delete(userDeleted : User) {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/users/delete',userDeleted,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
