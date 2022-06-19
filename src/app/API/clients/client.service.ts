import { ResponseAPI } from './../../Response/ResponseAPI';
import { Client } from './../../Models/Client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from 'src/app/Models/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http : HttpClient) { }

  clients()
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Client[]>('http://127.0.0.1:8000/api/clients/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  create(newClient : Client)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/clients/create',newClient,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  update(client : Client)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/clients/update',client,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  delete(client : Client) {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/clients/delete',client,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
