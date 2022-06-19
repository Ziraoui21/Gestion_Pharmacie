import { Notify, Confirm } from 'notiflix';
import { ClientService } from './../../API/clients/client.service';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { Client } from './../../Models/Client';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Facture } from 'src/app/Models/Facture';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  clients !: Client[];
  factures !: Facture[];
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  idClient !: number;

  is_edit : boolean = false;
  formNotValid : boolean = false;

  constructor(private clientsAPI : ClientService, private fb : FormBuilder
    ,private auth : AuthServiceService) { }

    is_admin : boolean = this.auth.is_admin();

  form = this.fb.group({
    id : [''],
    nom : ['',Validators.required],
    genre : ['',Validators.required],
    tele : ['',[Validators.required,Validators.pattern('^0(6|5|7)[0-9]{8}$')]]
  })

  get getId() { return this.form.get('id'); }
  get getNom() { return this.form.get('nom'); }
  get getGenre() { return this.form.get('genre'); }
  get getTele() { return this.form.get('tele'); }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
    };

    Notify.init({
      useFontAwesome: true,
      fontFamily: 'Nunito',
      fontSize: '15px',
      width: '300px',
      cssAnimationStyle : 'from-top',
      success : {
        fontAwesomeClassName: 'fa-solid fa-circle-check',
        fontAwesomeIconColor: '#ffffff',
      },
      failure : {
        fontAwesomeClassName: 'fa-solid fa-exclamation',
        fontAwesomeIconColor: '#ffffff',
      }
    });

    this.clientsAPI.clients().subscribe((data)=>{
        this.clients = data;
        this.dtTrigger.next(0);
    });

  }

  edit(client : Client) : void {

    this.is_edit = true;

    // document.getElementById("modalopen")?.click();

    this.form.patchValue({
        id : client.id,
        nom : client.nom,
        genre : client.genre,
        tele : client.tele
    });
  }

  update()
  {
    const client = new Client();
    client.id = this.getId?.value;
    client.nom = this.getNom?.value;
    client.genre = this.getGenre?.value;
    client.tele = this.getTele?.value;

    if(this.form.valid)
    {
      this.clientsAPI.update(client).subscribe((data)=>{
        if(data.status)
        {
          Notify.success(`Modification de client ${client.nom} a réussie`);
          this.reloadClients();
        }
        else
        {
          Notify.failure("Cet numéro de téléphone déja utilisé par un autre utilisateur")
        }
      })
    }
    else
    {
      this.formNotValid = true;
    }
  }

  create() 
  {
    const client = new Client();
    client.nom = this.getNom?.value;
    client.genre = this.getGenre?.value;
    client.tele = this.getTele?.value;

    if(this.form.valid)
    {
      this.clientsAPI.create(client).subscribe((data)=>{
        if(data.status)
        {
          Notify.success(`L'ajout de client ${client.nom} a réussie`);
          this.resetForm();
          this.reloadClients();
        }
        else
        {
          Notify.failure("Cet numéro de téléphone déja utilisé par un autre utilisateur");
        }
      })
    }
    else
    {
      this.formNotValid = true;
    }
  }

  delete(client : Client)
  {
    Confirm.init({
      okButtonBackground : "#e84118",
      titleColor : "#2f3640"
    });

    Confirm.show(
      'Supprimer',
      `Voulez vous vraiment supprimer le client ${client?.nom}`,
      'Oui',
      'Nom',
      () => {
        this.clientsAPI.delete(client).subscribe((data)=>{
          if(data.status)
          {
            Notify.success("la suppression a réussie");
            this.reloadClients()
          }
        })
      },
    );
  }

  setFactures(factures : Facture[])
  {
      this.factures = factures;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

  reloadClients(): void {
      this.clientsAPI.clients().subscribe((data)=>{
        this.rerender();
        this.clients = data;
    });
  }

  resetForm() {
    this.form.reset();
    this.formNotValid = false;
    const select = document.getElementById('genre') as HTMLSelectElement | null;
    if (select != null) {
      select.selectedIndex = 0;
    }
  }

  createMode()
  {
    this.is_edit = false;
    this.formNotValid = false;
    this.resetForm();
  }

}
