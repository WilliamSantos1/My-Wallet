import { type Transaction } from "./Transaction";

export type BankType = "CC"|"CP"|"CARTAO"|"POUPANCA"|"COFRINHO"|"INVESTIMENTO"|"CDB"|"CDI"|"TIPO";

export interface Bank {
    id: number;
    name: string;
    balance: number;
    rendimento: number;
    transactions: Transaction[];
    type: BankType;
    bankColor:string;
}