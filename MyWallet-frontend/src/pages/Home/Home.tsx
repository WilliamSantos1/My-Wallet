import { useEffect, useMemo, useState } from 'react'
import "../../index.css";
import"./Home.css"
import type { Bank } from '../../types/Bank';
import fetchData from '../../services/fetchData';
import BankCard from '../../components/HomeComponents/BankCard/BankCard';
import type { Transaction } from '../../types/Transaction';
import TransactionCard from '../../components/HomeComponents/TransactionCard/TransactionCard';
import type { Transfer } from '../../types/Transfer';
import CreateTransactionModal from '../../components/HomeComponents/CreateTransactionModal/CreateTransactionModal';
import CreateBankModal from '../../components/HomeComponents/CreateBankModal/CreatebankModal';

export const mockbankData: Bank[] = [
  {
    id: 1,
    name: "Nubank texto nome texto nome",
    balance: 12500000000.75,
    rendimento: 132.48,
    type: "CDB",
    transactions: [],
    bankColor: '#8a2be2'
  },
  {
    id: 2,
    name: "Banco Inter",
    balance: 8450.2,
    rendimento: 54.31,
    type: "CDI",
    transactions: [],
     bankColor: '#8a2be2'
  },
  {
    id: 3,
    name: "Caixa Econômica",
    balance: 3200,
    rendimento: 18.9,
    type: "POUPANCA",
    transactions: [],
     bankColor: '#8a2be2'
  },
  {
    id: 4,
    name: "Itaú",
    balance: 25680.9,
    rendimento: 287.56,
    type: "CDB",
    transactions: [],
     bankColor: '#8a2be2'
  },
];

export const mocktransactionData: Transaction[] = [
  {
    id: 1,
    description: "Depósito de dinheiro.",
    amount: 150.0,
    date: "2026-12-10T08:15:00",
    bankId: 1,
    bankName: "Mercado Pago",
    type: "INCOME",
  },
  {
    id: 2,
    description: "Pensão do Junior",
    amount: 1000.0,
    date: "2026-12-11T18:40:00",
    bankId: 2,
    bankName: "Mercado Pago",
    type: "EXPENSE",
  },
  {
    id: 3,
    description: "Gastos da feira mensal",
    amount: 400.0,
    date: "2026-12-10T15:20:00",
    bankId: 2,
    bankName: "Nubank Cofrinho",
    type: "EXPENSE",
  },
];
export const mocktransferData: Transfer[] = [
  {
    id: 1,
    description: "Depósito de dinheiro.",
    amount: 150.0,
    date: "2026-12-10T10:30:00",
    sourceBankId: 1,
    sourceBankName: "Mercado Pago",
    destinationBankId: 2,
    destinationBankName: "Nubank Cofrinho",
  },
  {
    id: 2,
    description: "Pagar cartão atrasado.",
    amount: 2000.0,
    date: "2026-12-11T09:10:00",
    sourceBankId: 1,
    sourceBankName: "Mercado Pago",
    destinationBankId: 2,
    destinationBankName: "Itaú",
  },
  {
    id: 3,
    description: "Reativar caixinha.",
    amount: 500.0,
    date: "2026-12-10T20:45:00",
    sourceBankId: 1,
    sourceBankName: "Bradesco",
    destinationBankId: 2,
    destinationBankName: "Mercado Pago",
  },
];

function Home() {
const [bankData, setBankData] = useState<Bank[]>([]);
const [transactionData, setTransactionData] = useState <Transaction[]>([]);
const [transferData,setTransferData] = useState<Transfer[]>([]);
const [openTransactionModal, setOpenTransactionModal] = useState(false);
const [openBankModal, setOpenBankModal]= useState(false);
const [transactionEdit, setTransactionEdit] = useState <Transaction|Transfer>();
const [openEditransactionModal, setOpenEditTransactionModal] = useState(false);

const sortedOperations = useMemo(() => {
    return [
        ...transactionData.map((transaction) => ({
            type: "transaction" as const,
            data: transaction,
        })),
        ...transferData.map((transfer) => ({
            type: "transfer" as const,
            data: transfer,
        })),
    ].sort(
        (a, b) =>
            new Date(b.data.date).getTime() -
            new Date(a.data.date).getTime()
    );
}, [transactionData, transferData]);

const fetchHomeData = async()=>{
    await Promise.all([
        fetchData([
            {
                endpoint: "/banks",
                params: {},
                setData: setBankData,
            },
        ]),
        fetchData([
            {
                endpoint: "/transactions",
                params: {},
                setData: setTransactionData,
            },
        ]),
        fetchData([
            {
                endpoint: "/transfers",
                params: {},
                setData: setTransferData,
            },
        ]),
    ]);
  }

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onCreateTransaction = async ()=>{
   await fetchHomeData(); 
  }
  const onEditTransaction = ( transaction: Transaction|Transfer)=>{
    setTransactionEdit(transaction);
    setOpenEditTransactionModal(true);
  }

  const onUpdateBanks = async ()=>{
    fetchData([
            {
                endpoint: "/banks",
                params: {},
                setData: setBankData,
            },
        ])
  }

  return (
    <>
    <div className='home__main-container'>
       <div style={{"display":"flex","flexDirection":"column"}}>
      <div className='home__transaction-header'>
           <h4 style={{"margin":0}}>Bancos & investimentos</h4>
          <div className='home__button-plus' onClick={()=>setOpenBankModal(true)}>
            <p className='home__button-text'>+</p>
          </div>
        </div>
      <div className='home__bank-container'>
        {bankData.map((bank) => (
          <BankCard 
          bankData = {bank}
          method='interact'
          onUpdateBanks={onUpdateBanks}/>
        ))}
      </div>
      </div>

      <div style={{"display":"flex","flexDirection":"column"}}>
        <div className='home__transaction-header'>
           <h4 style={{"margin":0}}>Últimas operações</h4>
         <div className='home__button-plus' onClick={() => setOpenTransactionModal(true)}>
          <p className='home__button-text'>+</p>
        </div>
        </div>
        <div className="home__transaction-container">
          {sortedOperations.map((operation) => {
                if (operation.type === "transaction") {
                    return (
                        <TransactionCard
                            key={`${operation.type}-${operation.data.id}`}
                            type="transaction"
                            transactionData={operation.data}
                            onEditTransaction={onEditTransaction}
                        />
                    );
                }

                return (
                    <TransactionCard
                        key={`${operation.type}-${operation.data.id}`}
                        type="transfer"
                        transactionData={operation.data}
                        onEditTransaction={onEditTransaction}
                    />
                );
          })}
        </div>
      </div>
    </div>
    <CreateTransactionModal
      open={openTransactionModal}
      onOpenChange={setOpenTransactionModal}
      onCreateTransaction={onCreateTransaction}
      bankData={bankData}
      method='create'
    />
    <CreateTransactionModal
      open={openEditransactionModal}
      onOpenChange={setOpenEditTransactionModal}
      onCreateTransaction={onCreateTransaction}
      bankData={bankData}
      method='edit'
      transaction={transactionEdit}
    />
    <CreateBankModal
    open={openBankModal}
    onOpenChange={setOpenBankModal}
    onUpdateBanks={onUpdateBanks}
    method='create'/>
    </>
  )
}


export default Home