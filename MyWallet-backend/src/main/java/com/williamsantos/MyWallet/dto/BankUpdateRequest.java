package com.williamsantos.MyWallet.dto;

import com.williamsantos.MyWallet.entity.BankType;

import java.math.BigDecimal;

public class BankUpdateRequest {

    private String name;
    private BankType type;
    private BigDecimal rendimento;
    private String bankColor;

    // getters e setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getBankColor() {
        return bankColor;
    }
}

