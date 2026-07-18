package com.williamsantos.MyWallet.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferResponse {

    private Long id;

    private Long sourceBankId;
    private String sourceBankName;

    private Long destinationBankId;
    private String destinationBankName;

    private BigDecimal amount;

    private LocalDateTime date;

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSourceBankId() {
        return sourceBankId;
    }

    public void setSourceBankId(Long sourceBankId) {
        this.sourceBankId = sourceBankId;
    }

    public String getSourceBankName() {
        return sourceBankName;
    }

    public void setSourceBankName(String sourceBankName) {
        this.sourceBankName = sourceBankName;
    }

    public Long getDestinationBankId() {
        return destinationBankId;
    }

    public void setDestinationBankId(Long destinationBankId) {
        this.destinationBankId = destinationBankId;
    }

    public String getDestinationBankName() {
        return destinationBankName;
    }

    public void setDestinationBankName(String destinationBankName) {
        this.destinationBankName = destinationBankName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
