import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILicense } from '../license.model';

@Component({
  selector: 'jhi-license-detail',
  templateUrl: './license-detail.component.html',
})
export class LicenseDetailComponent implements OnInit {
  license: ILicense | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ license }) => {
      this.license = license;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
