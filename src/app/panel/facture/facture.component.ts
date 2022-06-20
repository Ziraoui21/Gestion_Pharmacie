import { FactureService } from './../../API/Factures/facture.service';
import { Facture } from './../../Models/Facture';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Confirm, Notify } from 'notiflix';
import { Medicament } from 'src/app/Models/Medicament';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  factures !: Facture[];
  medicaments !: Medicament[];
  HT !: number;
  TVA !: number;
  TTC !: number;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private facturesAPI : FactureService) { }

  ngOnInit(): void {
    Confirm.init({
      titleColor : "#2f3640"
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[2, 'desc']]
    };

    this.facturesAPI.factures().subscribe((data)=>{
      this.factures = data;
      this.dtTrigger.next(0);
    })
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

  confirmer(facture : Facture)
  {
    Confirm.init({
      titleColor : "#2f3640"
    });

    Confirm.show(
      'Confirmation',
      `Voulez vous vraiment confirmer ce facture`,
      'Oui',
      'Nom',
      () => {
        this.facturesAPI.confirm(facture).subscribe((data)=>{
          if(data.status)
          {
            Notify.success("Cette facture a confirmé avec succés");
            this.relaodFactures();
          }
        })
      },
    );
  }

  setDetails(facture : Facture)
  {
    this.medicaments = facture.medicaments;
    this.facturesAPI.calculer(facture.id).subscribe((data)=>{
      this.HT = data.HT;
      this.TVA = this.HT * 0.20;
      this.TTC = parseFloat(this.HT.toString()) + parseFloat(this.TVA.toString());
    });
  }

  relaodFactures()
  {
    this.facturesAPI.factures().subscribe((data)=>{
      this.rerender();
      this.factures = data;
    });
  }

  resetCalcul()
  {
    this.HT = 0;
    this.TVA = 0;
    this.TTC = 0;
    this.medicaments = [];
  }
}
