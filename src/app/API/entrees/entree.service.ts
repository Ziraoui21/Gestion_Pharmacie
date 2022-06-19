import { ResponseAPI } from './../../Response/ResponseAPI';
import { Medicament } from './../../Models/Medicament';
import { AuthUser } from './../../Models/AuthUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntreeService {

  constructor(private http : HttpClient) { }

  medicaments()
  {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Medicament[]>('http://127.0.0.1:8000/api/entrees/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  create(medicament : Medicament,qte : number)
  {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    const data = {
      id : medicament.id,
      qte : qte
    }
    
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/entrees/create',data,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
