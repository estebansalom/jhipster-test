import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICurrency } from '../currency.model';
import { CurrencyService } from '../service/currency.service';
import { CurrencyDeleteDialogComponent } from '../delete/currency-delete-dialog.component';

@Component({
  selector: 'jhi-currency',
  templateUrl: './currency.component.html',
})
export class CurrencyComponent implements OnInit {
  currencies?: ICurrency[];
  isLoading = false;

  constructor(protected currencyService: CurrencyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.currencyService.query().subscribe(
      (res: HttpResponse<ICurrency[]>) => {
        this.isLoading = false;
        this.currencies = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICurrency): number {
    return item.id!;
  }

  delete(currency: ICurrency): void {
    const modalRef = this.modalService.open(CurrencyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.currency = currency;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
