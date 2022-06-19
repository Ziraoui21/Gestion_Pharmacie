import { ResponseAPI } from '../Response/ResponseAPI';
import { Facture } from './Facture';

export class Client{

    id !: number;
    nom !: string;
    genre !: string;
    tele !: string;
    factures !: Facture[];
    response !: ResponseAPI;
}