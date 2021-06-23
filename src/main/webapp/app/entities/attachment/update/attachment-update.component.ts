import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAttachment, Attachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';

@Component({
  selector: 'jhi-attachment-update',
  templateUrl: './attachment-update.component.html',
})
export class AttachmentUpdateComponent implements OnInit {
  isSaving = false;

  transactionsSharedCollection: ITransaction[] = [];

  editForm = this.fb.group({
    id: [],
    url: [],
    name: [],
    alt: [],
    description: [],
    transaction: [],
  });

  constructor(
    protected attachmentService: AttachmentService,
    protected transactionService: TransactionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attachment }) => {
      this.updateForm(attachment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attachment = this.createFromForm();
    if (attachment.id !== undefined) {
      this.subscribeToSaveResponse(this.attachmentService.update(attachment));
    } else {
      this.subscribeToSaveResponse(this.attachmentService.create(attachment));
    }
  }

  trackTransactionById(index: number, item: ITransaction): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttachment>>): void {
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

  protected updateForm(attachment: IAttachment): void {
    this.editForm.patchValue({
      id: attachment.id,
      url: attachment.url,
      name: attachment.name,
      alt: attachment.alt,
      description: attachment.description,
      transaction: attachment.transaction,
    });

    this.transactionsSharedCollection = this.transactionService.addTransactionToCollectionIfMissing(
      this.transactionsSharedCollection,
      attachment.transaction
    );
  }

  protected loadRelationshipsOptions(): void {
    this.transactionService
      .query()
      .pipe(map((res: HttpResponse<ITransaction[]>) => res.body ?? []))
      .pipe(
        map((transactions: ITransaction[]) =>
          this.transactionService.addTransactionToCollectionIfMissing(transactions, this.editForm.get('transaction')!.value)
        )
      )
      .subscribe((transactions: ITransaction[]) => (this.transactionsSharedCollection = transactions));
  }

  protected createFromForm(): IAttachment {
    return {
      ...new Attachment(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      name: this.editForm.get(['name'])!.value,
      alt: this.editForm.get(['alt'])!.value,
      description: this.editForm.get(['description'])!.value,
      transaction: this.editForm.get(['transaction'])!.value,
    };
  }
}
