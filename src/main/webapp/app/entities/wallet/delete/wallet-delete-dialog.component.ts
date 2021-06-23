import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWallet } from '../wallet.model';
import { WalletService } from '../service/wallet.service';

@Component({
  templateUrl: './wallet-delete-dialog.component.html',
})
export class WalletDeleteDialogComponent {
  wallet?: IWallet;

  constructor(protected walletService: WalletService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.walletService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
