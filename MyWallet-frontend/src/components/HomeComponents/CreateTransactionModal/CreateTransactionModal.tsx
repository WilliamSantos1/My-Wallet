import { useEffect, useState } from "react";
import "./CreateTransactionModal.css"
import * as Dialog from "@radix-ui/react-dialog";
import type { Bank } from "../../../types/Bank";
import type { Transaction, TransactionType } from "../../../types/Transaction";
import postData from "../../../services/postData";
import type { Transfer } from "../../../types/Transfer";
import { request } from "../../../services/request";

interface CreateTransactionModalProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateTransaction: ()=> void;
    bankData: Bank[];
    method:"create"|"edit";
    transaction?: Transaction | Transfer
}

const CreateTransactionModal = ({open, bankData, method, transaction, onOpenChange,onCreateTransaction}:CreateTransactionModalProps)=>{
    const [description, setDescription] = useState<string>('');
    const [value, setValue] = useState<number | undefined>();
    const [type, setType] = useState<string | undefined>();
    const [selectedBankSaldo, setSelectedBankSaldo] = useState<number | undefined>();
    const [transfer, setTransfer] = useState<boolean>(false);
    const [sourceBankId, setSourceBankId] = useState<number | undefined>();
    const [destinationBankId, setDestinationBankId] = useState<number | undefined>();

    useEffect(() => {
    const bank = bankData.find(bank => bank.id === sourceBankId);

    setSelectedBankSaldo(bank?.balance);
    }, [sourceBankId, bankData]);

    useEffect(() => {
        if (method !== "edit" || !transaction) return;

        setDescription(transaction.description);
        setValue(transaction.amount);

        if ("sourceBankId" in transaction) {
            // É uma transferência
            setTransfer(true);
            setSourceBankId(transaction.sourceBankId);
            setDestinationBankId(transaction.destinationBankId);
        } else {
            // É uma transação
            setTransfer(false);
            setType(transaction.type);
            setSourceBankId(transaction.bankId);
            setDestinationBankId(undefined);
        }
    }, [method, transaction, open]);

    const resetForm = () => {
        setDescription("");
        setValue(undefined);
        setType(undefined);
        setSelectedBankSaldo(undefined);
        setTransfer(false);
        setSourceBankId(undefined);
        setDestinationBankId(undefined);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }

            onOpenChange(isOpen);
        };

    const handlePostTransaction = async()=>{

       if(transfer === false){
          await postData({
            endpoint: "/transactions",
            body: {
                description: description,
                amount: value,
                bankId: sourceBankId,
                type: type,
            },
            onSuccess: () => {
                console.log("Transação criada com sucesso!");
            },
        });
       }else{
        await postData({
            endpoint: "/transfers",
            body: {
                description: description,
                amount: value,
                sourceBankId: sourceBankId,
                destinationBankId:destinationBankId,
                
            },
            onSuccess: () => {
                console.log("Transferência criada com sucesso!"); 
            },
        });
       }
         resetForm();          // Limpa os campos
         await onCreateTransaction(); // Atualiza a lista
         onOpenChange(false);   // Fecha o modal
    }
    const handleEditTransaction = async()=>{

       if(method === "create"){
        return;
       }
       if(transaction === undefined){
        return;
       }

       if("sourceBankId" in transaction){
          await request<Transfer>(
            "patch",
            `/transfers/${transaction.id}`,
             {
                description: description,
                amount: value,
                sourceBankId: sourceBankId,
                destinationBankId:destinationBankId,
            }
            
        );
       }else{
        await request<Transaction>(
            "patch",
            `/transaction/${transaction.id}`,
             {
                description: description,
                amount: value,
                bankId: sourceBankId,
                type: type,
                
            }
            
        );
       }
         resetForm();          // Limpa os campos
         await onCreateTransaction(); // Atualiza a lista
         onOpenChange(false);   // Fecha o modal
    }

    return(
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="transaction-modal__overlay" />

                <Dialog.Content className="transaction-modal__content">
                    <Dialog.Title>
                        Nova transação
                    </Dialog.Title>

                    <div className="transaction-modal__body">
                        <div className="transaction-modal__header">
                        <select
                            style={{"width":"100%"}}
                            value={sourceBankId ?? ""}
                            onChange={(e) => setSourceBankId(Number(e.target.value))}
                        >
                            <option value="">Selecione o banco</option>

                            {bankData.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            style={{"width":"100%"}}
                            placeholder="Saldo"
                            min={0}
                            value={selectedBankSaldo ?? ""}
                        />
                        </div>

                        <div className="transaction-modal__header">
                         <input
                            type="number"
                             style={{"width":"100%"}}
                            placeholder="Valor da transferência"
                            min={0}
                            value={value ?? ""}
                            onChange={(e) => {
                                const newValue = e.target.value;

                                setValue(newValue === "" ? undefined : Math.max(0, Number(newValue)));
                            }}
                          />
                          <select
                            value={transfer? "T": type ?? ""}
                            style={{"width":"100%"}}
                            onChange={(e) => setType(e.target.value)}
                            disabled={transfer === true}
                        >
                            <option value="">Selecione o tipo da Transação</option>
                            <option value="INCOME">Depósito</option>
                            <option value="EXPENSE">Despesa</option>
                            {transfer && <option value="T">Transferência</option>}
                        </select>
                        </div>
                        <textarea
                            value={description}
                            placeholder="Descrição"
                            onChange={(e)=>setDescription(e.target.value)}
                            
                        />
                        <label className="transaction-modal__checkbox">
                        <input
                                type="checkbox"
                                checked={transfer}
                                onChange={(e) => setTransfer(e.target.checked)}
                                disabled={method==="edit"}
                         />
                            Transferência
                        </label>
                        {transfer &&<>
                        <select
                            value={destinationBankId ?? ""}
                            onChange={(e) => setDestinationBankId(Number(e.target.value))}
                        >
                            <option value="">Selecione o banco de destino</option>

                            {bankData
                            .filter((bank) => bank.id !== sourceBankId)
                            .map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        </>}
                        

                        <button onClick={method === "create"? ()=>handlePostTransaction() : ()=>handleEditTransaction()}>
                            {`${method === "create"? "Criar":"Editar"}`}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
export default CreateTransactionModal;