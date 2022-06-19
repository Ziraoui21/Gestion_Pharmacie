import { Medicament } from './../../Models/Medicament';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Notify } from 'notiflix';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/API/stock/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  medicaments !: Medicament[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  medicament !: Medicament;

  formNotValid : boolean = false;

  constructor(private stockAPI : StockService, private fb : FormBuilder) { }

  form = this.fb.group({
    qte : [1,[Validators.required,Validators.min(1)]]
  });

  get getQte() { return this.form.get('qte'); }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[3, 'asc']],
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

    this.stockAPI.medicaments().subscribe((data)=>{
      this.medicaments = data;
      this.dtTrigger.next(0);
    });
  }


  setMedicament(medicament : Medicament) {
    this.medicament = medicament;
  } 

  commander() {
    if(this.form.valid)
    {
      this.stockAPI.commander(this.medicament.fournisseur.id,this.medicament.id,this.getQte?.value)
      .subscribe((data)=>{
        if(data.status)
        {
          Notify.success('La commande a envoyé au fournisseur avec succés');
          this.resetForm();
        }
      });
    }
    else
    {
      this.formNotValid = true;
    }
  }

  resetForm() {
    this.getQte?.patchValue(1);
    this.formNotValid = false;
  }

}
