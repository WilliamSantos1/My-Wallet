package com.williamsantos.MyWallet.dto;

import com.williamsantos.MyWallet.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
public class TransactionUpdateRequest {

    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDateTime date;
    private Long bankId;

    // getters e setters

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getBankId() {
        return bankId;
    }

    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }
}
