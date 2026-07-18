package com.williamsantos.MyWallet.repository;

import com.williamsantos.MyWallet.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferRepository
        extends JpaRepository<Transfer, Long> {
}
