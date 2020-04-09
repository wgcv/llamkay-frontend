export interface Company {
    _id: number;
    name: string;
    logo: string;
    available: boolean;
    paymentType: string;
    paymentFrequency: string;
    billing: boolean;
}