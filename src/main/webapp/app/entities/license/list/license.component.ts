import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILicense } from '../license.model';
import { LicenseService } from '../service/license.service';
import { LicenseDeleteDialogComponent } from '../delete/license-delete-dialog.component';

@Component({
  selector: 'jhi-license',
  templateUrl: './license.component.html',
})
export class LicenseComponent implements OnInit {
  licenses?: ILicense[];
  isLoading = false;

  constructor(protected licenseService: LicenseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.licenseService.query().subscribe(
      (res: HttpResponse<ILicense[]>) => {
        this.isLoading = false;
        this.licenses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILicense): number {
    return item.id!;
  }

  delete(license: ILicense): void {
    const modalRef = this.modalService.open(LicenseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.license = license;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
