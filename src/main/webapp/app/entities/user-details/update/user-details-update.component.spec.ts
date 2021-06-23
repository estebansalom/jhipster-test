jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserDetailsService } from '../service/user-details.service';
import { IUserDetails, UserDetails } from '../user-details.model';
import { ILicense } from 'app/entities/license/license.model';
import { LicenseService } from 'app/entities/license/service/license.service';
import { IContact } from 'app/entities/contact/contact.model';
import { ContactService } from 'app/entities/contact/service/contact.service';

import { UserDetailsUpdateComponent } from './user-details-update.component';

describe('Component Tests', () => {
  describe('UserDetails Management Update Component', () => {
    let comp: UserDetailsUpdateComponent;
    let fixture: ComponentFixture<UserDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userDetailsService: UserDetailsService;
    let licenseService: LicenseService;
    let contactService: ContactService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userDetailsService = TestBed.inject(UserDetailsService);
      licenseService = TestBed.inject(LicenseService);
      contactService = TestBed.inject(ContactService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call license query and add missing value', () => {
        const userDetails: IUserDetails = { id: 456 };
        const license: ILicense = { id: 74540 };
        userDetails.license = license;

        const licenseCollection: ILicense[] = [{ id: 85661 }];
        jest.spyOn(licenseService, 'query').mockReturnValue(of(new HttpResponse({ body: licenseCollection })));
        const expectedCollection: ILicense[] = [license, ...licenseCollection];
        jest.spyOn(licenseService, 'addLicenseToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(licenseService.query).toHaveBeenCalled();
        expect(licenseService.addLicenseToCollectionIfMissing).toHaveBeenCalledWith(licenseCollection, license);
        expect(comp.licensesCollection).toEqual(expectedCollection);
      });

      it('Should call Contact query and add missing value', () => {
        const userDetails: IUserDetails = { id: 456 };
        const contacts: IContact[] = [{ id: 50883 }];
        userDetails.contacts = contacts;

        const contactCollection: IContact[] = [{ id: 45990 }];
        jest.spyOn(contactService, 'query').mockReturnValue(of(new HttpResponse({ body: contactCollection })));
        const additionalContacts = [...contacts];
        const expectedCollection: IContact[] = [...additionalContacts, ...contactCollection];
        jest.spyOn(contactService, 'addContactToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(contactService.query).toHaveBeenCalled();
        expect(contactService.addContactToCollectionIfMissing).toHaveBeenCalledWith(contactCollection, ...additionalContacts);
        expect(comp.contactsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const userDetails: IUserDetails = { id: 456 };
        const license: ILicense = { id: 79450 };
        userDetails.license = license;
        const contacts: IContact = { id: 23357 };
        userDetails.contacts = [contacts];

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userDetails));
        expect(comp.licensesCollection).toContain(license);
        expect(comp.contactsSharedCollection).toContain(contacts);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = { id: 123 };
        jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = new UserDetails();
        jest.spyOn(userDetailsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userDetails }));
        saveSubject.complete();

        // THEN
        expect(userDetailsService.create).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = { id: 123 };
        jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLicenseById', () => {
        it('Should return tracked License primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLicenseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackContactById', () => {
        it('Should return tracked Contact primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackContactById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedContact', () => {
        it('Should return option if no Contact is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedContact(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Contact for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedContact(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Contact is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedContact(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
