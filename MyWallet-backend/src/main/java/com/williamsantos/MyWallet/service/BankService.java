package com.williamsantos.MyWallet.service;

import com.williamsantos.MyWallet.dto.BankRequest;
import com.williamsantos.MyWallet.dto.BankResponse;
import com.williamsantos.MyWallet.dto.BankUpdateRequest;
import com.williamsantos.MyWallet.dto.RendimentoResponse;
import com.williamsantos.MyWallet.entity.Bank;
import com.williamsantos.MyWallet.exception.BankNotFoundException;
import com.williamsantos.MyWallet.repository.BankRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class BankService {

    private final BankRepository repository;

    public BankService(BankRepository repository) {
        this.repository = repository;
    }
    private BankResponse toResponse(Bank bank) {

        BankResponse response = new BankResponse();

        response.setId(bank.getId());
        response.setName(bank.getName());
        response.setBalance(bank.getBalance());
        response.setType(bank.getType());
        response.setRendimento(bank.getRendimento());
        response.setBankColor(bank.getBankColor());

        return response;
    }
    public List<BankResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BankResponse create(BankRequest request) {

        Bank bank = new Bank();

        bank.setName(request.getName());
        bank.setType(request.getType());
        if(request.getBalance() == null){
            bank.setBalance(BigDecimal.ZERO);
        }else{
            bank.setBalance(request.getBalance());
        }
        bank.setRendimento(request.getRendimento());
        bank.setBankColor(request.getBankColor());

        Bank saved = repository.save(bank);

        return toResponse(saved);
    }

    public Bank update(Long id, BankUpdateRequest request) {

        Bank bank = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banco não encontrado."));

        if (request.getName() != null && !request.getName().isBlank()) {
            bank.setName(request.getName());
        }
        if (request.getType() != null) {
            bank.setType(request.getType());
        }
        if(request.getRendimento() != null){
            bank.setRendimento(request.getRendimento());
        }
        if(request.getBankColor() != null){
            bank.setBankColor(request.getBankColor());
        }

        return repository.save(bank);
    }

    public void delete(Long id) {
    //Só é possível excluir um banco sem tranações

        Bank bank = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banco não encontrado."));

        if (!bank.getTransactions().isEmpty()) {
            throw new RuntimeException("Não é possível excluir um banco que possui transações.");
        }

        repository.delete(bank);
    }
    private BigDecimal applyInterest(BigDecimal balance, double annualRate, int days){
        double value = balance.doubleValue();
        double finalValue = value + Math.pow(1+annualRate/365.0, days);
        return BigDecimal.valueOf(finalValue).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateByType(Bank bank, Integer days){
        BigDecimal balance = bank.getBalance();
        return switch (bank.getType()){
            case CC -> balance;
            case CP -> applyInterest(balance, 0.005, days);
            case INVESTMENTO -> applyInterest(balance, bank.getRendimento().doubleValue()/100,days);
            default -> throw new IllegalArgumentException("Tipo de Banco inválido: "+ bank.getType());
        };
    }

    public RendimentoResponse calculateRendimento(Long bankId, Integer days){
        Bank bank = repository.findById(bankId).orElseThrow(()-> new BankNotFoundException(bankId));

        BigDecimal finalBalance = calculateByType(bank, days);

        RendimentoResponse response = new RendimentoResponse();
        response.setProfit(finalBalance.subtract(bank.getBalance()));
        response.setDays(days);

        return response;
    }
}
