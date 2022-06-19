import { Ventes } from './../../Models/Ventes';
import { AuthUser } from './../../Models/AuthUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentesService {
  constructor(private http : HttpClient) { }

  ventes()
  {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Ventes>('http://127.0.0.1:8000/api/ventes/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
