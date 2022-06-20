import { Fournisseur } from './../../Models/Fournisseur';
import { Medicament } from './../../Models/Medicament';
import { MedicamentService } from './../../API/Medicaments/medicament.service';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { Confirm, Notify } from 'notiflix';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Entree } from 'src/app/Models/Entree';
import { Sortie } from 'src/app/Models/Sortie';
import { Facture } from 'src/app/Models/Facture';

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.css']
})
export class MedicamentsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  medicaments !:Medicament[];
  fournisseurs !: Fournisseur[];
  entrees !: Entree[];
  sorties !: Sortie[];
  factures !: Facture[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  hasFactures : boolean = false;
  hasSorties : boolean = false;
  hasEntrees : boolean = false;

  is_edit : boolean = false;
  formNotValid : boolean = false;

  is_admin : boolean = this.auth.is_admin();

  constructor(private medicamentsAPI : MedicamentService, private fb : FormBuilder
    ,private auth : AuthServiceService) { }

  form = this.fb.group({
    id : [''],
    libelle : ['',Validators.required],
    prix_achat : ['',Validators.required],
    prix_vente : ['',Validators.required],
    qte_s : ['',Validators.required],
    date_expiration : [new Date(),Validators.required],
    fournisseur_id : ['',Validators.required],
  })

  get getId() { return this.form.get('id'); }
  get getLibelle() { return this.form.get('libelle'); }
  get getPrixAchat() { return this.form.get('prix_achat'); }
  get getPrixVente() { return this.form.get('prix_vente'); }
  get getQteS() { return this.form.get('qte_s'); }
  get getDateExpiration() { return this.form.get('date_expiration'); }
  get getFournisseurId() { return this.form.get('fournisseur_id'); }

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

    this.medicamentsAPI.medicaments().subscribe((data)=>{
      // console.log(data);
      this.medicaments = data;
      this.dtTrigger.next(0);
    });

    this.medicamentsAPI.getFournisseurs().subscribe((data)=>{
      this.fournisseurs = data;
    });
  }

  create() 
  {
    const medicament = new Medicament();
    medicament.libelle = this.getLibelle?.value;
    medicament.prix_achat = this.getPrixAchat?.value;
    medicament.prix_vente = this.getPrixVente?.value;
    medicament.qte_s = this.getQteS?.value;
    medicament.date_expiration = this.getDateExpiration?.value;
    medicament.fournisseur_id = this.getFournisseurId?.value;
    

    if(this.form.valid && this.checkdate())
    {
      this.medicamentsAPI.create(medicament).subscribe((data)=>{
        if(data.status)
        {
          this.reloadMedicaments();
          Notify.success(`Le médicament ${medicament.libelle} a ajouté avec succés`);
          this.resetForm();
        }
      })
    }
    else
    {
      this.formNotValid = true;
    }
  }

  edit(medicament : Medicament) : void {

    this.is_edit = true;

    this.form.patchValue({
      id : medicament.id,
      libelle : medicament.libelle,
      prix_vente : medicament.prix_vente,
      prix_achat : medicament.prix_achat,
      qte_s : medicament.qte_s,
      date_expiration : medicament.date_expiration,
      fournisseur_id : medicament.fournisseur_id,
    });
  }

  update()
  {
    const medicament = new Medicament();
    medicament.id = this.getId?.value;
    medicament.libelle = this.getLibelle?.value;
    medicament.prix_achat = this.getPrixAchat?.value;
    medicament.prix_vente = this.getPrixVente?.value;
    medicament.qte_s = this.getQteS?.value;
    medicament.date_expiration = this.getDateExpiration?.value;
    medicament.fournisseur_id = this.getFournisseurId?.value;

    if(this.form.valid && this.checkdate())
    {
      this.medicamentsAPI.update(medicament).subscribe((data)=>{
        if(data.status)
        {
          Notify.success(`Le médicament ${medicament.libelle} a modifié avec succés`);
          this.reloadMedicaments();
        }
      })
    }
    else
    {
      this.formNotValid = true;
    }
  }

  delete(medicament : Medicament)
  {
    Confirm.init({
      okButtonBackground : "#e84118",
      titleColor : "#2f3640"
    });

    Confirm.show(
      'Supprimer',
      `Voulez vous vraiment supprimer le médicament ${medicament?.libelle}`,
      'Oui',
      'Nom',
      () => {
        this.medicamentsAPI.delete(medicament).subscribe((data)=>{
          if(data.status)
          {
            Notify.success("la suppression a réussie");
            this.reloadMedicaments();
          }
        })
      },
    );
  }

  setOperation(medicament: Medicament)
  {
    if(medicament.entrees.length != 0)
    {
      this.entrees = medicament.entrees;
      this.hasEntrees = true;
    }
    if(medicament.sorties.length != 0)
    {
      this.sorties = medicament.sorties;
      this.hasSorties = true;
    }
    if(medicament.factures.length != 0)
    {
      this.factures = medicament.factures;
      this.hasFactures = true;
    }
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

  resetForm() {
    this.form.reset();
    this.getDateExpiration?.patchValue(new Date());
    this.formNotValid = false;
    const select = document.getElementById('fournisseur') as HTMLSelectElement | null;
    if (select != null) {
      select.selectedIndex = 0;
    }
  }

  resetInfos()
  {
    this.factures = [];
    this.entrees = [];
    this.sorties = [];

    this.hasEntrees = false;
    this.hasSorties = false;
    this.hasFactures = false;
  }

  reloadMedicaments(): void {
    this.medicamentsAPI.medicaments().subscribe((data)=>{
      this.rerender();
      this.medicaments = data;
    });
  }

  createMode()
  {
    this.is_edit = false;
    this.formNotValid = false;
    this.resetForm();
  }

  checkdate()
  {
    const dateExpiration = new Date(this.getDateExpiration?.value);
    const dateNow = new Date();
    
    return dateExpiration.getTime() > dateNow.getTime() ||
    dateExpiration.toDateString() == dateNow.toDateString();
  }

  checkExpiration(date : string) 
  {
    const dateExpiration = new Date(date);
    const dateNow = new Date();
    
    return dateExpiration.getTime() > dateNow.getTime() ||
    dateExpiration.toDateString() == dateNow.toDateString();
  }

}
