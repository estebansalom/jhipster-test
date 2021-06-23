import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { ILicense } from 'app/entities/license/license.model';
import { LicenseService } from 'app/entities/license/service/license.service';
import { IContact } from 'app/entities/contact/contact.model';
import { ContactService } from 'app/entities/contact/service/contact.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;

  licensesCollection: ILicense[] = [];
  contactsSharedCollection: IContact[] = [];

  editForm = this.fb.group({
    id: [],
    country: [],
    phone: [],
    license: [],
    contacts: [],
  });

  constructor(
    protected userDetailsService: UserDetailsService,
    protected licenseService: LicenseService,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.createFromForm();
    if (userDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  trackLicenseById(index: number, item: ILicense): number {
    return item.id!;
  }

  trackContactById(index: number, item: IContact): number {
    return item.id!;
  }

  getSelectedContact(option: IContact, selectedVals?: IContact[]): IContact {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
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

  protected updateForm(userDetails: IUserDetails): void {
    this.editForm.patchValue({
      id: userDetails.id,
      country: userDetails.country,
      phone: userDetails.phone,
      license: userDetails.license,
      contacts: userDetails.contacts,
    });

    this.licensesCollection = this.licenseService.addLicenseToCollectionIfMissing(this.licensesCollection, userDetails.license);
    this.contactsSharedCollection = this.contactService.addContactToCollectionIfMissing(
      this.contactsSharedCollection,
      ...(userDetails.contacts ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.licenseService
      .query({ filter: 'userdetails-is-null' })
      .pipe(map((res: HttpResponse<ILicense[]>) => res.body ?? []))
      .pipe(
        map((licenses: ILicense[]) => this.licenseService.addLicenseToCollectionIfMissing(licenses, this.editForm.get('license')!.value))
      )
      .subscribe((licenses: ILicense[]) => (this.licensesCollection = licenses));

    this.contactService
      .query()
      .pipe(map((res: HttpResponse<IContact[]>) => res.body ?? []))
      .pipe(
        map((contacts: IContact[]) =>
          this.contactService.addContactToCollectionIfMissing(contacts, ...(this.editForm.get('contacts')!.value ?? []))
        )
      )
      .subscribe((contacts: IContact[]) => (this.contactsSharedCollection = contacts));
  }

  protected createFromForm(): IUserDetails {
    return {
      ...new UserDetails(),
      id: this.editForm.get(['id'])!.value,
      country: this.editForm.get(['country'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      license: this.editForm.get(['license'])!.value,
      contacts: this.editForm.get(['contacts'])!.value,
    };
  }
}
