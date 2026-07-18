import "./BankCard.css"
import "../../../types/Bank"
import type { Bank } from "../../../types/Bank"
import { useState } from "react";
import CreateBankModal from "../CreateBankModal/CreatebankModal";

interface BankCardProps {
    bankData: Bank;
    method: "interact"|"placehouder"
    onUpdateBanks?: () => void;
}

const BankCard = ({ bankData, method, onUpdateBanks }: BankCardProps) =>{
    const [openEditModal, setOpenEditMoal] = useState<boolean>(false);
    
    const bankTypeLabels: Record<string, string> = {
        CP: "Conta Poupança",
        CC:"Conta Corrente",
        COFRINHO: "Cofrinho",
        CARTAO: "Cartão",
        INVESTIMENTO: "Investimento",
        CDB: "CDB",
        CDI: "CDI",
        TIPO:"Tipo do banco"
    };
    function getContrastColor(backgroundColor: string, whiteColor:string) {
        const hex = backgroundColor.replace("#", "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Luminância
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? "#000000" : whiteColor;
        }

        const textColor = getContrastColor(bankData.bankColor, "#FFFFFF");
        const borderColor = getContrastColor(bankData.bankColor, bankData.bankColor)

    return(
        <>
        <div className="bank-card__container"
        style={{ "--card-color": bankData.bankColor,
            "--text-color": textColor,
            "--border-color":borderColor,
         } as React.CSSProperties}>
            {method === "interact" &&(
            <button onClick={()=>setOpenEditMoal(true)}>
                ...
            </button>
            )}
            <div className="bank-card__text-box">
                <p className="bank-card__text">{bankData.name}</p>
            </div>
            <div>
                <div className="bank-card__balance-box">
                   <p className="bank-card__balance-text">{`R$${bankData.balance.toFixed(2).replace(".", ",")}`}</p>
                </div>
                <p className="bank-card__text"> {bankTypeLabels[bankData.type]} - {bankData.rendimento}%</p>
            </div>
        </div>
        
       {onUpdateBanks !== undefined &&(
        <CreateBankModal
        open={openEditModal}
        onOpenChange={setOpenEditMoal}
        onUpdateBanks={onUpdateBanks}
        method="edit"
        bank={bankData}/>
       )}
        </>
    )
}
export default BankCard