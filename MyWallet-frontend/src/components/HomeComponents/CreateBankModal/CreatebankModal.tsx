import { useEffect, useState } from "react";
import "./CreateBankModal.css"
import * as Dialog from "@radix-ui/react-dialog";
import { HexColorPicker } from "react-colorful";
import BankCard from "../BankCard/BankCard";
import type { Bank, BankType } from "../../../types/Bank";
import { request } from "../../../services/request";


interface BankModal{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateBanks:() => void; 
    method: "edit"|"create";
    bank?:Bank;
}

const CreateBankModal = ({open, onOpenChange, onUpdateBanks, method, bank}:BankModal)=>{
    const [name, setName] = useState<string>('');
    const [balance, setBalance] = useState<number | undefined>();
    const [type, setType] = useState<string|undefined>('');
    const [rendimento, setRendimento] = useState<number | undefined>();
    const [bankColor, setBankColor] = useState("#2563eb");
    const placeholderBank: Bank ={
        id: 1,
        name: name ? name: "Nome do banco",
        balance: balance ? balance : 0,
        type: (type ? type: "TIPO") as BankType,
        rendimento: rendimento? rendimento : 0,
        bankColor: bankColor,
        transactions: [],
    }
     useEffect(() => {

        if(method === "edit" && bank !== undefined){
            setName(bank.name);
            setBalance(bank.balance);
            setType(bank.type);
            setRendimento(bank.rendimento);
            setBankColor(bank.bankColor);
        }
    }, [open]);



    const resetForm = () => {
        setName("");
        setBalance(undefined);
        setType(undefined);
        setRendimento(undefined);
        setBankColor("#2563eb");
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }

            onOpenChange(isOpen);
        };

    const handleCreateBank = async()=>{
        if(method === "edit"){
            return;
        }
        if(name === ""){
            return;
        }
        if(type === undefined || type === ""){
            return;
        }
        if(rendimento === undefined){
            return;
        }
        if(balance === undefined){
            return;
        }

        await request <Bank>(
            "post",
            "/banks",
            {
                name: name,
                balance: balance,
                rendimento: rendimento,
                type: type,
                bankColor: bankColor
            }
        );

         resetForm();          // Limpa os campos
         await onUpdateBanks(); // Atualiza a lista
         onOpenChange(false); 
    }
    const handleEditBank = async()=>{
        if(method === "create"){
            return;
        }
        if(bank === undefined){
            return;
        }
        if(name === ""){
            return;
        }
        if(type === undefined || type === ""){
            return;
        }
        if(rendimento === undefined){
            return;
        }
        if(balance === undefined){
            return;
        }

        await request <Bank>(
            "patch",
            `/banks/${bank?.id}`,
            {
                name: name,
                balance: balance,
                rendimento: rendimento,
                type: type,
                bankColor: bankColor
            }
        );

         resetForm();          // Limpa os campos
         await onUpdateBanks(); // Atualiza a lista
         onOpenChange(false); 
    }

    return(
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="transaction-modal__overlay" />

                <Dialog.Content className="transaction-modal__content">
                    <Dialog.Title>
                        Novo Banco/Investimento
                    </Dialog.Title>
                    <div className="transaction-modal__body">
                        <input
                                value={name}
                                placeholder="Nome do Banco"
                                onChange={(e) => setName(e.target.value)}
                         />
                        <select
                            
                            value={type ?? ""}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">Selecione tipo o banco</option>
                            <option value="CP">Conta Poupança</option>
                            <option value="CC">Conta Corrente</option>
                            <option value="CARTAO">Cartão</option>
                            <option value="COFRINHO">Cofrinho</option>
                            <option value="INVESTIMENTO">Investimento</option>
                            
                        </select>
                         <input
                            type="number"
                            placeholder="Saldo do banco"
                            min={0}
                            value={balance ?? ""}
                            onChange={(e) => {
                                const newValue = e.target.value;

                                setBalance(newValue === "" ? undefined : Math.max(0, Number(newValue)));
                            }}
                          />
                        <input
                            type="number"
                            placeholder="Rendimento em porcentagem"
                            min={0}
                            value={rendimento ?? ""}
                            onChange={(e) => {
                                const newValue = e.target.value;

                                setRendimento(newValue === "" ? undefined : Math.max(0, Number(newValue)));
                            }}
                          />
                          <div className="bank-modal__header">
                          <BankCard bankData={placeholderBank} method="placehouder"/>
                          <HexColorPicker color={bankColor} onChange={setBankColor} />
                          </div>
                        <button onClick={method === "create"? ()=> handleCreateBank(): ()=> handleEditBank()}>
                           {method === "create"? " Criar": "Editar"}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
export default CreateBankModal;