export interface Transfer{
    id:number;
    sourceBankId: number;
    sourceBankName: string;
    destinationBankId: number;
    destinationBankName: string;
    amount: number;
    description: string;
    date:string;
}