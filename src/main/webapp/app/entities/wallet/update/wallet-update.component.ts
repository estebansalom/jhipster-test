import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWallet, Wallet } from '../wallet.model';
import { WalletService } from '../service/wallet.service';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';
import { IIcon } from 'app/entities/icon/icon.model';
import { IconService } from 'app/entities/icon/service/icon.service';

@Component({
  selector: 'jhi-wallet-update',
  templateUrl: './wallet-update.component.html',
})
export class WalletUpdateComponent implements OnInit {
  isSaving = false;

  userDetailsSharedCollection: IUserDetails[] = [];
  iconsSharedCollection: IIcon[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    currency: [],
    initialBalance: [],
    inReports: [],
    user: [],
    icon: [],
  });

  constructor(
    protected walletService: WalletService,
    protected userDetailsService: UserDetailsService,
    protected iconService: IconService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wallet }) => {
      this.updateForm(wallet);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const wallet = this.createFromForm();
    if (wallet.id !== undefined) {
      this.subscribeToSaveResponse(this.walletService.update(wallet));
    } else {
      this.subscribeToSaveResponse(this.walletService.create(wallet));
    }
  }

  trackUserDetailsById(index: number, item: IUserDetails): number {
    return item.id!;
  }

  trackIconById(index: number, item: IIcon): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWallet>>): void {
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

  protected updateForm(wallet: IWallet): void {
    this.editForm.patchValue({
      id: wallet.id,
      name: wallet.name,
      description: wallet.description,
      currency: wallet.currency,
      initialBalance: wallet.initialBalance,
      inReports: wallet.inReports,
      user: wallet.user,
      icon: wallet.icon,
    });

    this.userDetailsSharedCollection = this.userDetailsService.addUserDetailsToCollectionIfMissing(
      this.userDetailsSharedCollection,
      wallet.user
    );
    this.iconsSharedCollection = this.iconService.addIconToCollectionIfMissing(this.iconsSharedCollection, wallet.icon);
  }

  protected loadRelationshipsOptions(): void {
    this.userDetailsService
      .query()
      .pipe(map((res: HttpResponse<IUserDetails[]>) => res.body ?? []))
      .pipe(
        map((userDetails: IUserDetails[]) =>
          this.userDetailsService.addUserDetailsToCollectionIfMissing(userDetails, this.editForm.get('user')!.value)
        )
      )
      .subscribe((userDetails: IUserDetails[]) => (this.userDetailsSharedCollection = userDetails));

    this.iconService
      .query()
      .pipe(map((res: HttpResponse<IIcon[]>) => res.body ?? []))
      .pipe(map((icons: IIcon[]) => this.iconService.addIconToCollectionIfMissing(icons, this.editForm.get('icon')!.value)))
      .subscribe((icons: IIcon[]) => (this.iconsSharedCollection = icons));
  }

  protected createFromForm(): IWallet {
    return {
      ...new Wallet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      initialBalance: this.editForm.get(['initialBalance'])!.value,
      inReports: this.editForm.get(['inReports'])!.value,
      user: this.editForm.get(['user'])!.value,
      icon: this.editForm.get(['icon'])!.value,
    };
  }
}
