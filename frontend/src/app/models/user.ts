export class User{
    _id: string = "";
    name: string = "";
    email: string = "";
    phonenumber: string = "";
    password: string = "";
    role: string = "ADMIN" || "USER";
    points: number = 0;
}