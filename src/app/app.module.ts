import { GuestGuard } from './Guard/guest.guard';
import { AuthGuard } from './Guard/auth.guard';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { MainLayoutComponent } from './panel/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './panel/AuthComponents/profile/profile.component';
import { SettingsComponent } from './panel/AuthComponents/settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './panel/users/users.component';
import { ClientsComponent } from './panel/clients/clients.component';
import { FournisseurComponent } from './panel/fournisseur/fournisseur.component';
import { MedicamentsComponent } from './panel/medicaments/medicaments.component';
import { EntreesComponent } from './panel/entrees/entrees.component';
import { FactureComponent } from './panel/facture/facture.component';
import { StockComponent } from './panel/stock/stock.component';
import { VentesComponent } from './panel/ventes/ventes.component';
import { AchatComponent } from './panel/achat/achat.component';
import { DashboardComponent } from './panel/dashboard/dashboard.component';
import { AdminGuard } from './Guard/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    ProfileComponent,
    SettingsComponent,
    NotFoundComponent,
    UsersComponent,
    ClientsComponent,
    FournisseurComponent,
    MedicamentsComponent,
    EntreesComponent,
    FactureComponent,
    StockComponent,
    VentesComponent,
    AchatComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [
    AuthServiceService,
    AuthGuard,
    GuestGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
