import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from 'src/app/Models/AuthUser';
import { DashboardResponse } from 'src/app/Response/DashboardResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http : HttpClient){ }

  get_infos()
  {
    let user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
    return this.http.get<DashboardResponse>('http://127.0.0.1:8000/api/dashboard/infos',{
      headers : new HttpHeaders({Authorization : `Bearer ${user.token}`})
    });
  }
}
