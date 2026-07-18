export type TransactionType = "INCOME"|"EXPENSE";

export interface Transaction{
    id: number;
    description: string;
    type: TransactionType;
    bankName:string;
    amount: number;
    date: string;
    bankId: number;
}