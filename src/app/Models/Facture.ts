import { Medicament } from './Medicament';
import { Time } from "@angular/common";
import { ResponseAPI } from "../Response/ResponseAPI";
import { Medicament_facture } from './Medicament_facture';
import { Client } from './Client';

export class Facture{

    id !: number;
    prix_avance !: number;
    date_facture !: Date;
    heure_facture !: Time;
    HT !: number;
    client !: Client;
    medicaments !: Medicament[];
    pivot !: Medicament_facture;
    response !: ResponseAPI;
}