package com.williamsantos.MyWallet.controller;

import com.williamsantos.MyWallet.dto.BankRequest;
import com.williamsantos.MyWallet.dto.BankResponse;
import com.williamsantos.MyWallet.dto.BankUpdateRequest;
import com.williamsantos.MyWallet.dto.RendimentoResponse;
import com.williamsantos.MyWallet.entity.Bank;
import com.williamsantos.MyWallet.entity.Transaction;
import com.williamsantos.MyWallet.service.BankService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/banks")
public class BankController {

    private final BankService service;

    public BankController(BankService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<BankResponse> create(
            @RequestBody @Valid BankRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }
    @GetMapping
    public ResponseEntity<List<BankResponse>> findAll() {

        return ResponseEntity.ok(service.findAll());
    }
    @GetMapping("/{id}/rendimento")
    public ResponseEntity<RendimentoResponse>
    calculateRendimento(
            @PathVariable Long id,
            @RequestParam Integer days
    ){
        return ResponseEntity.ok(
                service.calculateRendimento(id, days)
        );
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Bank> update(
            @PathVariable Long id,
            @RequestBody BankUpdateRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
