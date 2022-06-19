import { ResponseAPI } from 'src/app/Response/ResponseAPI';
import { Fournisseur } from './../../Models/Fournisseur';
import { AuthUser } from './../../Models/AuthUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FournisseurServiceService {

  constructor(private http : HttpClient) { }

  fournisseurs()
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Fournisseur[]>('http://127.0.0.1:8000/api/fournisseurs/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  create(fournisseur : Fournisseur)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/fournisseurs/create',fournisseur,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  update(fournisseur : Fournisseur)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/fournisseurs/update',fournisseur,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
