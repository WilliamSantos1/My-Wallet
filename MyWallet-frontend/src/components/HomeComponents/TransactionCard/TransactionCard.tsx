import type { Transaction } from "../../../types/Transaction";
import type { Transfer } from "../../../types/Transfer";
import "./TransactionCard.css"

interface TransactionProps {
    type: "transaction";
    transactionData: Transaction;
    onEditTransaction: (transaction: Transaction)=> void;
}

interface TransferProps {
    type: "transfer";
    transactionData: Transfer;
    onEditTransaction: (transaction:Transfer)=> void;
}

type TransactionCardProps = TransactionProps | TransferProps;

export function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date)).replace(",", " às");
}

const TransactionCard = ({transactionData, type, onEditTransaction}: TransactionCardProps)=>{
    if (type === "transaction") {
    
        return(
     <div className="transaction-card__division">
         <div className={`"transaction-card__type"
            ${transactionData.type === "INCOME" ? "transaction-card__gain":"transaction-card__expense"}`}>         
        </div>
        <div className={`transaction-card__main-container`}>
             <div className={`transaction-card__header`}>
                <p>{formatDateTime(transactionData.date)} -{" "} 
                    <span className={`${transactionData.type === "INCOME"? "transaction-card__bank-name-g":"transaction-card__bank-name-d"}`}>
                        {transactionData.bankName}:{" "}
                        {transactionData.type === "INCOME"? "+":"-"}
                     R${transactionData.amount.toFixed(2).replace(".", ",")}</span>
                    </p>
                    <button onClick={()=>onEditTransaction(transactionData)}>
                        editar
                    </button>
            </div>
           
            <p>{transactionData.description}</p>
        </div>
        </div>
     );}

    return(
        <div className="transaction-card__division">
         <div className={"transaction-card__transfer"}>         
        </div>
        <div className={`transaction-card__main-container`}> 
            <div className="transaction-card__header">
                <p>
                {formatDateTime(transactionData.date)} - Transferência de{" "}
                <span className="transaction-card__bank-name-t">{transactionData.sourceBankName}</span>
                {" "}para{" "}
                <span className="transaction-card__bank-name-t">{transactionData.destinationBankName}
                    : R${transactionData.amount.toFixed(2).replace(".", ",")}
                </span>
                
                </p>
                <button onClick={()=>onEditTransaction(transactionData)}>
                        editar
                 </button>
            </div>
            <p>{transactionData.description}</p>
        </div>
        </div>
        );
}
export default TransactionCard