import { ResponseAPI } from "../Response/ResponseAPI";
import { Entree } from "./Entree";
import { Facture } from "./Facture";
import { Fournisseur } from "./Fournisseur";
import { Medicament_facture } from "./Medicament_facture";

import { Sortie } from "./Sortie";

export class Medicament{

    id !: number;
    fournisseur_id !: number;
    libelle !: string;
    prix_achat !: number;
    prix_vente !: number;
    TTC !: number;
    qte_s !: number;
    date_expiration !: Date;
    fournisseur !: Fournisseur;
    factures !: Facture[];
    pivot !: Medicament_facture;
    entrees !: Entree[];
    sorties !: Sortie[];
    response !: ResponseAPI;
}