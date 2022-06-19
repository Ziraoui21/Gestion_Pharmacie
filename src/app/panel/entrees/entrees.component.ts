import { Medicament } from './../../Models/Medicament';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Notify } from 'notiflix';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { EntreeService } from 'src/app/API/entrees/entree.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-entrees',
  templateUrl: './entrees.component.html',
  styleUrls: ['./entrees.component.css']
})
export class EntreesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  medicaments !: Medicament[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  medicament !: Medicament;

  formNotValid : boolean = false;

  constructor(private entreeAPI : EntreeService, private fb : FormBuilder) { }

  form = this.fb.group({
    qte : [1,[Validators.required,Validators.min(1)]]
  });

  get getQte() { return this.form.get('qte'); }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[3, 'desc']],
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
      }
    });

    this.entreeAPI.medicaments().subscribe((data)=>{
      this.medicaments = data;
      this.dtTrigger.next(0);
    });
  }

  setMedicament(medicament : Medicament) {
     this.medicament = medicament;
  }

  create()
  {
    if(this.form.valid)
    {
      this.entreeAPI.create(this.medicament,this.getQte?.value).subscribe((data)=>{
        console.log(data)
        if(data.status)
        {
          Notify.success("L'augmentation de stock a réussie");
          this.getQte?.patchValue(1);
          this.reloadMedicaments();
        }
      })
    }
    else
      this.formNotValid = false;
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

  reloadMedicaments(): void {
    this.entreeAPI.medicaments().subscribe((data)=>{
      this.rerender();
      this.medicaments = data;
    });
  }

  resetForm() {
    this.getQte?.patchValue(1);
    this.formNotValid = false;
  }

}
