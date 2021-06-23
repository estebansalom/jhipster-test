import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';
import { AttachmentDeleteDialogComponent } from '../delete/attachment-delete-dialog.component';

@Component({
  selector: 'jhi-attachment',
  templateUrl: './attachment.component.html',
})
export class AttachmentComponent implements OnInit {
  attachments?: IAttachment[];
  isLoading = false;

  constructor(protected attachmentService: AttachmentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.attachmentService.query().subscribe(
      (res: HttpResponse<IAttachment[]>) => {
        this.isLoading = false;
        this.attachments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAttachment): number {
    return item.id!;
  }

  delete(attachment: IAttachment): void {
    const modalRef = this.modalService.open(AttachmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.attachment = attachment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
