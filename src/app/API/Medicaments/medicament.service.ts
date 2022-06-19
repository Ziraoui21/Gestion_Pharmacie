import { Fournisseur } from './../../Models/Fournisseur';
import { ResponseAPI } from 'src/app/Response/ResponseAPI';
import { Medicament } from './../../Models/Medicament';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from 'src/app/Models/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {

  constructor(private http : HttpClient) { }

  medicaments()
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Medicament[]>('http://127.0.0.1:8000/api/medicaments/all',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  getFournisseurs()
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<Fournisseur[]>('http://127.0.0.1:8000/api/medicaments/fournisseurs',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  create(medicament : Medicament)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/medicaments/create',medicament,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  update(medicament : Medicament)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/medicaments/update',medicament,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }

  delete(medicament : Medicament)
  { 
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.post<ResponseAPI>('http://127.0.0.1:8000/api/medicaments/delete',medicament,{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
