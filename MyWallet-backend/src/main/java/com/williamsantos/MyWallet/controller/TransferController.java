package com.williamsantos.MyWallet.controller;

import com.williamsantos.MyWallet.dto.TransferRequest;
import com.williamsantos.MyWallet.dto.TransferResponse;
import com.williamsantos.MyWallet.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transfers")
public class TransferController {

    private final TransferService service;

    public TransferController(TransferService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TransferResponse> transfer(
            @Valid @RequestBody TransferRequest request) {

        TransferResponse response = service.transfer(request);

        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<TransferResponse>> findAll() {

        return ResponseEntity.ok(service.findAll());
    }
}
