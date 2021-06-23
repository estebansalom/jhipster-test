import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWallet } from '../wallet.model';

@Component({
  selector: 'jhi-wallet-detail',
  templateUrl: './wallet-detail.component.html',
})
export class WalletDetailComponent implements OnInit {
  wallet: IWallet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wallet }) => {
      this.wallet = wallet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
