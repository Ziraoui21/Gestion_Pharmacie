import { DashboardComponent } from './panel/dashboard/dashboard.component';
import { AchatComponent } from './panel/achat/achat.component';
import { StockComponent } from './panel/stock/stock.component';
import { EntreesComponent } from './panel/entrees/entrees.component';
import { MedicamentsComponent } from './panel/medicaments/medicaments.component';
import { FournisseurComponent } from './panel/fournisseur/fournisseur.component';
import { ClientsComponent } from './panel/clients/clients.component';
import { UsersComponent } from './panel/users/users.component';
import { GuestGuard } from './Guard/guest.guard';
import { AuthGuard } from './Guard/auth.guard';
import { MainLayoutComponent } from './panel/main-layout/main-layout.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { FactureComponent } from './panel/facture/facture.component';
import { VentesComponent } from './panel/ventes/ventes.component';
import { AdminGuard } from './Guard/admin.guard';

const routes: Routes = [
  {
    path : 'login',
    component : LoginComponent,
    canActivate : [GuestGuard]
  },
  {
    path : 'main',
    component : MainLayoutComponent,
    canActivate : [AuthGuard],
    children : [
      {
        path : 'achats',
        component : AchatComponent
      },
      {
        path : 'ventes',
        component : VentesComponent,
        canActivate : [AdminGuard]
      },
      {
        path : 'stock',
        component : StockComponent
      },
      {
        path : 'factures',
        component : FactureComponent
      },
      {
        path : 'operations/entrees',
        component : EntreesComponent
      },
      {
        path : 'medicaments',
        component : MedicamentsComponent
      },
      {
        path : 'clients',
        component : ClientsComponent
      },
      {
        path : 'fournisseurs',
        component : FournisseurComponent
      },
      {
        path : 'users',
        component : UsersComponent,
        canActivate : [AdminGuard]
      },
      {
        path: 'dashboard',
        component : DashboardComponent
      },
      {
        path: '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
      }
    ]
  },
  {
    path : '',
    redirectTo : 'login',
    pathMatch : 'full'
  },
  {
    path : '**',
    component : NotFoundComponent,
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
