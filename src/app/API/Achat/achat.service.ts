import { Medicament } from 'src/app/Models/Medicament';
import { Client } from './../../Models/Client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from 'src/app/Models/AuthUser';
import { Sortie } from 'src/app/Models/Sortie';
import { ResponseAPI } from 'src/app/Response/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class AchatService {

  constructor(private http : HttpClient) { }

  clients()
  {
    const user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    
    return this.http.get<Client[]>('http://127.0.0.1:8000/api/achats/clients',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  medicaments()
  {
    const user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    
    return this.http.get<Medicament[]>('http://127.0.0.1:8000/api/achats/medicaments',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  createSortie(sortie : Sortie){
    const user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/achats/sortie',sortie,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  createFacture(data : any)
  {
    const user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/achats/facture',data,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
