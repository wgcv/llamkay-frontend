export interface User {
    _id: number;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    company: string;
    isAdmin: boolean;
    permissions: any;
    department: string;
    position: string;
    resetPasswordToken: string,
}