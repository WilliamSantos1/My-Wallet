package com.williamsantos.MyWallet.dto;

import com.williamsantos.MyWallet.entity.BankType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class BankRequest {

    @NotBlank
    private String name;

    @NotNull
    @PositiveOrZero
    private BigDecimal balance;
    private BigDecimal rendimento;
    private BankType type;
    private String bankColor;

    // getters e setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BankType getType() {
        return type;
    }

    public void setType(BankType type) {
        this.type = type;
    }

    public BigDecimal getRendimento() {
        return rendimento;
    }

    public void setRendimento(BigDecimal rendimento) {
        this.rendimento = rendimento;
    }

    public void setBankColor(String bankColor) {
        this.bankColor = bankColor;
    }

    public String getBankColor() {
        return bankColor;
    }
}
