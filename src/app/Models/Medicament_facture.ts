import { Medicament } from './Medicament';

export class Medicament_facture{
    id !: number;
    qte !: number;
    TTC !: number;
    created_at !: Date;
    medicament_id !: number;
    medicament !: Medicament;
}