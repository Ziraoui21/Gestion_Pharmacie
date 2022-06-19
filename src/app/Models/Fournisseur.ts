import { ResponseAPI } from "../Response/ResponseAPI";
import { Medicament } from "./Medicament";

export class Fournisseur{
    
    id !: number;
    nom_f !: string;
    email !: string;
    tele !: string;
    adresse !: string;
    medicaments !: Medicament[];
    response !: ResponseAPI;
}