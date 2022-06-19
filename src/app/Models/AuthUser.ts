import { ResponseAPI } from "../Response/ResponseAPI"

export class AuthUser{

    id !: number;
    name !: string;
    email !: string;
    newPassword !: string;
    role !: string;
    token !: string;
    response !: ResponseAPI;
}