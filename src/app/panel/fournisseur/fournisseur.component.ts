import { Medicament } from './../../Models/Medicament';
import { Fournisseur } from './../../Models/Fournisseur';
import { FournisseurServiceService } from './../../API/Fournisseur/fournisseur-service.service';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { Notify } from 'notiflix';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit,OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  fournisseurs !: Fournisseur[];
  detailsFournisseur !: Fournisseur;
  medicaments !: Medicament[];
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  idFournisseur !: number;

  is_edit : boolean = false;
  formNotValid : boolean = false;

  constructor(private fournisseursAPI : FournisseurServiceService, private fb : FormBuilder
    ,private auth : AuthServiceService) { }
    is_admin : boolean = this.auth.is_admin();

  form = this.fb.group({
    id : [''],
    nom_f : ['',Validators.required],
    tele : ['',[Validators.required,Validators.pattern('^0(6|5|7)[0-9]{8}$')]],
    email : ['',[Validators.required,Validators.email]],
    adresse : ['',Validators.required]
  })

  get getId() { return this.form.get('id'); }
  get getNomF() { return this.form.get('nom_f'); }
  get getEmail() { return this.form.get('email'); }
  get getTele() { return this.form.get('tele'); }
  get getAdresse() { return this.form.get('adresse'); }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
  };

    this.fournisseursAPI.fournisseurs().subscribe((data)=>{
      this.fournisseurs = data;
      this.dtTrigger.next(0);
    })

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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  create()
  {
    const fournisseur = new Fournisseur();
    fournisseur.nom_f = this.getNomF?.value;
    fournisseur.email = this.getEmail?.value;
    fournisseur.tele = this.getTele?.value;
    fournisseur.adresse = this.getAdresse?.value;

    if(this.form.valid)
    {
      this.fournisseursAPI.create(fournisseur).subscribe((data)=>{

        console.log(data);

        if(data.emailNotValid)
          Notify.failure("Cet adresse email déja utilisé par un autre fournisseur");
        if(data.teleNotValid)
          Notify.failure("Cet numéro de téléphone déja utilisé par un autre fournisseur");
        if(data.status)
        {
          Notify.success(`L'ajout de fournisseur ${fournisseur.nom_f} a réussie`);
          this.resetForm();
          this.reloadfournisseurs();
        }
      })
    }
    else
    {
      this.formNotValid = true;
    }
  }

  edit(fournisseur : Fournisseur) : void {

    this.is_edit = true;

    this.form.patchValue({
        id : fournisseur.id,
        nom_f : fournisseur.nom_f,
        tele : fournisseur.tele,
        email : fournisseur.email,
        adresse : fournisseur.adresse
    });
  }

  update()
  {
    const fournisseur = new Fournisseur();
    fournisseur.id = this.getId?.value;
    fournisseur.nom_f = this.getNomF?.value;
    fournisseur.email = this.getEmail?.value;
    fournisseur.tele = this.getTele?.value;
    fournisseur.adresse = this.getAdresse?.value;

    if(this.form.valid)
    {
      this.fournisseursAPI.update(fournisseur).subscribe((data)=>{
        if(data.emailNotValid)
          Notify.failure("Cet adresse email déja utilisé par un autre fournisseur");
        if(data.teleNotValid)
          Notify.failure("Cet numéro de téléphone déja utilisé par un autre fournisseur");
        if(data.status)
        {
          Notify.success(`Modification de fournisseur ${fournisseur.nom_f} a réussie`);
          this.reloadfournisseurs();
        }
      });
    }
    else
    {
      this.formNotValid = true;
    }
  }

  setFournisseur(fournisseur : Fournisseur)
  {
    this.detailsFournisseur = fournisseur;
  }

  setMedicaments(medicaments : Medicament[])
  {
    this.medicaments = medicaments;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

  reloadfournisseurs(): void {
      this.fournisseursAPI.fournisseurs().subscribe((data)=>{
        this.rerender();
        this.fournisseurs = data;
    });
  }

  resetForm() {
    this.form.reset();
    this.formNotValid = false;
  }

  createMode()
  {
    this.is_edit = false;
    this.formNotValid = false;
    this.resetForm();
  }

}
