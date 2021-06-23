import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILicense, License } from '../license.model';
import { LicenseService } from '../service/license.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

@Component({
  selector: 'jhi-license-update',
  templateUrl: './license-update.component.html',
})
export class LicenseUpdateComponent implements OnInit {
  isSaving = false;

  invoicesCollection: IInvoice[] = [];

  editForm = this.fb.group({
    id: [],
    invoice: [],
  });

  constructor(
    protected licenseService: LicenseService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ license }) => {
      this.updateForm(license);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const license = this.createFromForm();
    if (license.id !== undefined) {
      this.subscribeToSaveResponse(this.licenseService.update(license));
    } else {
      this.subscribeToSaveResponse(this.licenseService.create(license));
    }
  }

  trackInvoiceById(index: number, item: IInvoice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILicense>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(license: ILicense): void {
    this.editForm.patchValue({
      id: license.id,
      invoice: license.invoice,
    });

    this.invoicesCollection = this.invoiceService.addInvoiceToCollectionIfMissing(this.invoicesCollection, license.invoice);
  }

  protected loadRelationshipsOptions(): void {
    this.invoiceService
      .query({ filter: 'license-is-null' })
      .pipe(map((res: HttpResponse<IInvoice[]>) => res.body ?? []))
      .pipe(
        map((invoices: IInvoice[]) => this.invoiceService.addInvoiceToCollectionIfMissing(invoices, this.editForm.get('invoice')!.value))
      )
      .subscribe((invoices: IInvoice[]) => (this.invoicesCollection = invoices));
  }

  protected createFromForm(): ILicense {
    return {
      ...new License(),
      id: this.editForm.get(['id'])!.value,
      invoice: this.editForm.get(['invoice'])!.value,
    };
  }
}
