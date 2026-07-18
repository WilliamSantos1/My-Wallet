package com.williamsantos.MyWallet.service;

import com.williamsantos.MyWallet.dto.TransferRequest;
import com.williamsantos.MyWallet.dto.TransferResponse;
import com.williamsantos.MyWallet.entity.Bank;
import com.williamsantos.MyWallet.entity.Transaction;
import com.williamsantos.MyWallet.entity.TransactionType;
import com.williamsantos.MyWallet.entity.Transfer;
import com.williamsantos.MyWallet.repository.BankRepository;
import com.williamsantos.MyWallet.repository.TransactionRepository;
import com.williamsantos.MyWallet.repository.TransferRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransferService {

    private final BankRepository bankRepository;
    private final TransactionRepository transactionRepository;
    private final TransferRepository transferRepository;

    public TransferService(BankRepository bankRepository,
                           TransactionRepository transactionRepository,
                           TransferRepository transferRepository) {
        this.bankRepository = bankRepository;
        this.transactionRepository = transactionRepository;
        this.transferRepository = transferRepository;
    }

    // metodo para retornar o transferResponse
    private TransferResponse toResponse(Transfer transfer) {

        TransferResponse response = new TransferResponse();

        response.setId(transfer.getId());

        response.setSourceBankId(transfer.getSourceBank().getId());
        response.setSourceBankName(transfer.getSourceBank().getName());

        response.setDestinationBankId(transfer.getDestinationBank().getId());
        response.setDestinationBankName(transfer.getDestinationBank().getName());

        response.setAmount(transfer.getAmount());
        response.setDescription(transfer.getDescription());
        response.setDate(transfer.getDate());

        return response;
    }

    @Transactional
    public TransferResponse transfer(TransferRequest request) {

        Bank source = bankRepository.findById(request.getSourceBankId())
                .orElseThrow(() -> new RuntimeException("Banco origem não encontrado"));

        Bank destination = bankRepository.findById(request.getDestinationBankId())
                .orElseThrow(() -> new RuntimeException("Banco destino não encontrado"));

        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Saldo insuficiente.");
        }
        if (request.getSourceBankId().equals(request.getDestinationBankId())) {
            throw new RuntimeException("A conta de origem e destino devem ser diferentes.");
        }
        // Atualiza os saldos
        source.setBalance(
                source.getBalance().subtract(request.getAmount())
        );

        destination.setBalance(
                destination.getBalance().add(request.getAmount())
        );

        Transfer transfer = new Transfer();

        transfer.setSourceBank(source);
        transfer.setDestinationBank(destination);
        transfer.setAmount(request.getAmount());
        transfer.setDescription(request.getDescription());
        transfer.setDate(LocalDateTime.now());

        //transferRepository.save(transfer);

        Transfer savedTransfer = transferRepository.save(transfer);

        return toResponse(savedTransfer);
    }
    public List<TransferResponse> findAll() {

        return transferRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

}
