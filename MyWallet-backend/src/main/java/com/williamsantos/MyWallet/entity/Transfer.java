package com.williamsantos.MyWallet.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "source_bank_id", nullable = false)
    private Bank sourceBank;

    @ManyToOne
    @JoinColumn(name = "destination_bank_id", nullable = false)
    private Bank destinationBank;

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @OneToMany(mappedBy = "transfer")
    private List<Transaction> transactions = new ArrayList<>();

    // getters e setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Bank getSourceBank() {
        return sourceBank;
    }

    public void setSourceBank(Bank sourceBank) {
        this.sourceBank = sourceBank;
    }

    public Bank getDestinationBank() {
        return destinationBank;
    }

    public void setDestinationBank(Bank destinationBank) {
        this.destinationBank = destinationBank;
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
