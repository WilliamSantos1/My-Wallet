package com.williamsantos.MyWallet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class TransferRequest {

    @NotNull
    private Long sourceBankId;

    @NotNull
    private Long destinationBankId;

    @NotNull
    @Positive
    private BigDecimal amount;

    private String description;

    // getters e setters

    public Long getSourceBankId() {
        return sourceBankId;
    }

    public void setSourceBankId(Long sourceBankId) {
        this.sourceBankId = sourceBankId;
    }

    public Long getDestinationBankId() {
        return destinationBankId;
    }

    public void setDestinationBankId(Long destinationBankId) {
        this.destinationBankId = destinationBankId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
