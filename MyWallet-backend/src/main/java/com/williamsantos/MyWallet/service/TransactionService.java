package com.williamsantos.MyWallet.service;

import com.williamsantos.MyWallet.dto.TransactionRequest;
import com.williamsantos.MyWallet.dto.TransactionResponse;
import com.williamsantos.MyWallet.dto.TransactionUpdateRequest;
import com.williamsantos.MyWallet.entity.Bank;
import com.williamsantos.MyWallet.entity.Transaction;
import com.williamsantos.MyWallet.entity.TransactionType;
import com.williamsantos.MyWallet.exception.BankNotFoundException;
import com.williamsantos.MyWallet.repository.BankRepository;
import com.williamsantos.MyWallet.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BankRepository bankRepository;

    public TransactionService(TransactionRepository transactionRepository, BankRepository bankRepository) {

        this.transactionRepository = transactionRepository;
        this.bankRepository = bankRepository;
    }

    public List<TransactionResponse> findAll() {

        return transactionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    private TransactionResponse toResponse(Transaction transaction) {

        TransactionResponse response = new TransactionResponse();

        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setType(transaction.getType());
        response.setDate(transaction.getDate());

        response.setBankId(transaction.getBank().getId());
        response.setBankName(transaction.getBank().getName());

        return response;
    }

    public TransactionResponse create(TransactionRequest request) {

        Bank bank = bankRepository.findById(request.getBankId())
                .orElseThrow(() -> new BankNotFoundException(request.getBankId()));

        Transaction transaction = new Transaction();

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(LocalDateTime.now());
        transaction.setBank(bank);

        if (request.getType() == TransactionType.INCOME) {

            bank.setBalance(
                    bank.getBalance().add(request.getAmount())
            );

        } else {

            bank.setBalance(
                    bank.getBalance().subtract(request.getAmount())
            );

        }
        bankRepository.save(bank);
        Transaction saved = transactionRepository.save(transaction);

        return toResponse(saved);
    }
    public Transaction update(Long id, TransactionUpdateRequest request) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        Bank oldBank = transaction.getBank();

        // Remove o efeito da transação antiga
        if (transaction.getType() == TransactionType.INCOME) {
            oldBank.setBalance(oldBank.getBalance().subtract(transaction.getAmount()));
        } else {
            oldBank.setBalance(oldBank.getBalance().add(transaction.getAmount()));
        }

        // Atualiza os campos enviados
        if (request.getDescription() != null)
            transaction.setDescription(request.getDescription());

        if (request.getAmount() != null)
            transaction.setAmount(request.getAmount());

        if (request.getType() != null)
            transaction.setType(request.getType());

        if (request.getDate() != null)
            transaction.setDate(LocalDateTime.now());

        // Troca de banco (se enviada)
        Bank newBank = oldBank;

        if (request.getBankId() != null &&
                !request.getBankId().equals(oldBank.getId())) {

            newBank = bankRepository.findById(request.getBankId())
                    .orElseThrow(() -> new RuntimeException("Banco não encontrado"));

            transaction.setBank(newBank);
        }

        // Aplica o efeito da transação atualizada
        if (transaction.getType() == TransactionType.INCOME) {
            newBank.setBalance(newBank.getBalance().add(transaction.getAmount()));
        } else {
            newBank.setBalance(newBank.getBalance().subtract(transaction.getAmount()));
        }

        bankRepository.save(oldBank);

        if (!oldBank.getId().equals(newBank.getId())) {
            bankRepository.save(newBank);
        }

        return transactionRepository.save(transaction);
    }

    public void delete(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transação não encontrada.");
        }

        transactionRepository.deleteById(id);
    }

}
