package com.williamsantos.MyWallet.exception;

public class BankNotFoundException extends RuntimeException {

    public BankNotFoundException(Long id) {
        super("Banco com id " + id + " não encontrado.");
    }
}
