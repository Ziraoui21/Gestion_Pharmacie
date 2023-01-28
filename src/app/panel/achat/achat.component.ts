import { Notify } from 'notiflix';
import { Medicament_facture } from './../../Models/Medicament_facture';
import { Client } from './../../Models/Client';
import { Medicament } from './../../Models/Medicament';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AchatService } from 'src/app/API/Achat/achat.service';
import { Sortie } from 'src/app/Models/Sortie';

@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.css']
})
export class AchatComponent implements OnInit {

  constructor(private achatAPI : AchatService, private fb : FormBuilder) { }

  medicaments !: Medicament[];
  clients !: Client[];
  medicaments_facture : Medicament_facture[] = [];
  totalTTC : number = 0;

  formClientNotValid = false;
  formSortieNotValid = false;
  formMedicamentNotValid = false;

  formMedicament = this.fb.group({
    medicament_id : ['',Validators.required],
    qte : [1,[Validators.required,Validators.min(1)]],
    prix : [0]
  })

  formSortie = this.fb.group({
    medicament_id : ['',Validators.required],
    qte : [1,[Validators.required,Validators.min(1)]],
    espece : [1,[Validators.required,Validators.min(1)]],
    prix : [0]
  });

  formClient = this.fb.group({
    client_id : ['',Validators.required],
    espece : [1,[Validators.required,Validators.min(0)]],
    prix_avance : [0,Validators.min(0)]
  });

  get getS_MdID(){ return this.formSortie.get('medicament_id') }
  get getS_Qte(){ return this.formSortie.get('qte') }
  get getS_Espece(){ return this.formSortie.get('espece') }
  get getS_Prix(){ return this.formSortie.get('prix') }
  
  get getM_MID(){ return this.formMedicament.get('medicament_id') }
  get getM_Qte(){ return this.formMedicament.get('qte') }
  get getM_Prix(){ return this.formMedicament.get('prix') }

  get getF_CltID(){ return this.formClient.get('client_id') }
  get getF_Espece(){ return this.formClient.get('espece') }
  get getF_Prix_avance(){ return this.formClient.get('prix_avance') }

  ngOnInit(): void {

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

    this.getS_Prix?.disable();
    this.getM_Prix?.disable();

    this.achatAPI.clients().subscribe((data)=>{
      this.clients = data;
    });

    this.achatAPI.medicaments().subscribe((data)=>{
      this.medicaments = data;
    });
  }

  getMedId_S(id : string)
  {
      let medicament : Medicament = this.medicaments.find((med)=>{
        return med.id == parseInt(id);
      }) as Medicament;

      this.getS_Prix?.patchValue(medicament.prix_vente);
  }

  getMedId_M(id : string)
  {
      let medicament : Medicament = this.medicaments.find((med)=>{
        return med.id == parseInt(id);
      }) as Medicament;

      this.getM_Prix?.patchValue(medicament.prix_vente);
  }

  create_sortie()
  {
    if(this.formSortie.valid) {

      let sortie = new Sortie();

      sortie.medicament_id = this.getS_MdID?.value;
      sortie.qte = this.getS_Qte?.value;

      this.achatAPI.createSortie(sortie).subscribe((data)=>{
        if(data.status)
        {
          Notify.success("l'enregistrement du vente est réussie");
          document.getElementById('close')?.click();
          this.formSortie_reset();
        }
      })
    }
    else
      this.formSortieNotValid = true;
  }

  create_ligne()
  {
    if(this.formMedicament.valid)
    {
      let ligne = new Medicament_facture();
      ligne.medicament = this.medicaments.find((med)=>{
        return med.id == this.getM_MID?.value;
      }) as Medicament;
      
      ligne.medicament_id = ligne.medicament.id;
      ligne.qte = this.getM_Qte?.value;
      ligne.TTC = this.calculTTC(ligne.qte.toString(),ligne.medicament.prix_vente.toString())

      this.medicaments_facture.push(ligne);
      this.formMedicament_reset()
      Notify.success(`Le médicament ${ligne.medicament.libelle} est ajouté avec succés`);
      this.reloadMedicaments();
    }
    else
      this.formMedicamentNotValid = true;
  }

  delete_ligne(ligneD : Medicament_facture)
  {
    this.medicaments_facture = this.medicaments_facture.filter((ligne)=>{
      return ligne != ligneD;
    })
  }

  confirmer()
  {
    this.medicaments_facture.forEach((ligne)=>{
      this.totalTTC += ligne.TTC;
    })
  }

  create_facture()
  {
    if(this.formClient.valid)
    {
      const data = {
        client_id : this.getF_CltID?.value,
        prix_avance : this.getF_Prix_avance?.value,
        medicaments_facture : JSON.stringify(this.medicaments_facture)
      }

      this.achatAPI.createFacture(data).subscribe((data)=>{
        if(data.status)
        {
          Notify.success("la facture est confirmé avec succés");
          this.formClient_reset();
          document.getElementById('modalClose')?.click();
          this.medicaments_facture = [];
          this.reloadMedicaments();
        }
      })
    }
    else
      this.formClientNotValid = true;
  }

  calculTTC(qte : string,prix : string)
  {
    if(qte!=null)
    {
      const HT = parseInt(qte) * parseFloat(prix);
      const TVA = HT * 0.20;
      const TTC = HT + TVA;

      return TTC;
    }
    else
      return 0;
    
  }

  calculReste(ttc : number, espece : number)
  {
    return espece - ttc;
  }

  formSortie_reset()
  {
    this.formSortie.reset();
    this.getS_Qte?.patchValue(1);
    this.getS_Espece?.patchValue(1);
    this.getS_Prix?.patchValue(0);
    this.formSortieNotValid = false;
    const select = document.getElementById('med1') as HTMLSelectElement | null;
    if (select != null) {
      select.selectedIndex = 0;
    }

  }

  formMedicament_reset()
  {
    this.formMedicament.reset();
    this.getM_Qte?.patchValue(1);
    this.getM_Prix?.patchValue(0);
    this.getM_MID?.patchValue('');
    this.formMedicamentNotValid = false;
  }

  formClient_reset()
  {
    this.formClient.reset();
    this.getF_Espece?.patchValue(1);
    this.getF_Prix_avance?.patchValue(0);
    this.formClientNotValid = false;
    const select = document.getElementById('clt') as HTMLSelectElement | null;
    if (select != null) {
      select.selectedIndex = 0;
    }
  }

  reloadMedicaments() {
    this.achatAPI.medicaments().subscribe((data)=>{
      this.medicaments = data;
    })
  }

}
