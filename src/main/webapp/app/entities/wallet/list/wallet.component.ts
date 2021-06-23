import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWallet } from '../wallet.model';
import { WalletService } from '../service/wallet.service';
import { WalletDeleteDialogComponent } from '../delete/wallet-delete-dialog.component';

@Component({
  selector: 'jhi-wallet',
  templateUrl: './wallet.component.html',
})
export class WalletComponent implements OnInit {
  wallets?: IWallet[];
  isLoading = false;

  constructor(protected walletService: WalletService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.walletService.query().subscribe(
      (res: HttpResponse<IWallet[]>) => {
        this.isLoading = false;
        this.wallets = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWallet): number {
    return item.id!;
  }

  delete(wallet: IWallet): void {
    const modalRef = this.modalService.open(WalletDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.wallet = wallet;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
