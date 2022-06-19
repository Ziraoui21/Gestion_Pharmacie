import { Role } from './Role';
import { ResponseAPI } from "../Response/ResponseAPI"

export class User{

    id !: number;
    name !: string;
    email !: string;
    role !: Role;
    role_id !: number;
    password !: string;
    response !: ResponseAPI;
}