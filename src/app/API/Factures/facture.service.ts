import { Facture } from 'src/app/Models/Facture';
import { AuthUser } from './../../Models/AuthUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseAPI } from 'src/app/Response/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  constructor(private http : HttpClient) { }

  factures()
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Facture[]>('http://127.0.0.1:8000/api/factures/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  confirm(facture : Facture)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/factures/confirmer',facture,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  calculer(id : number)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    const data = {
      id : id
    }

    return this.http.post<Facture>('http://127.0.0.1:8000/api/factures/calculer',data,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
