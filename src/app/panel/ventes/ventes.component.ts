import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { VentesService } from 'src/app/API/ventes/ventes.service';
import { Ventes } from 'src/app/Models/Ventes';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.css']
})
export class VentesComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  ventes = new Ventes();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  totalTtc !: number;


  constructor(private ventesAPI : VentesService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[2, 'asc']],
    };

    this.ventesAPI.ventes().subscribe((data)=>{
      this.ventes = data;
      this.totalTtc = this.calculTotal();
      this.dtTrigger.next(0);
    })
  }

  calculTTC(qte : number, prix : number)
  {
    const HT = qte * prix;
    const TVA = HT * 0.20;
    const TTC = HT + TVA;

    return TTC;
  }

  calculTotal()
  {
    let totalTTC = 0;

    this.ventes.medicaments_facture.forEach((vente)=>{
      totalTTC += this.calculTTC(vente.qte,vente.medicament.prix_vente) 
    })

    this.ventes.sorties.forEach((vente)=>{
      totalTTC += this.calculTTC(vente.qte,vente.medicament.prix_vente) 
    })

    return totalTTC;
  }
}
