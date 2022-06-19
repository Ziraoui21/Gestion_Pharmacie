import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { DashboardResponse } from 'src/app/Response/DashboardResponse';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/API/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dashAPI : DashboardService,private auth : AuthServiceService) { }

  is_admin : boolean = this.auth.is_admin();
  dashRes = new DashboardResponse();

  ngOnInit(): void {
   this.dashAPI.get_infos().subscribe((data)=>{
    this.dashRes = data;
   });
  }

}
