import { ResponseAPI } from "../Response/ResponseAPI";
import { Medicament } from "./Medicament";

export class Sortie{

    id !: number;
    medicament_id !: number;
    qte !: number;
    date_sortie !: Date;
    medicament !: Medicament;
    response !: ResponseAPI;
}