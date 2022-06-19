import { ResponseAPI } from "../Response/ResponseAPI";
import { Medicament } from "./Medicament";

export class Entree{

    id !: number;
    qte !: number;
    date_entree !: Date;
    medicament !: Medicament;
    response !: ResponseAPI;
}