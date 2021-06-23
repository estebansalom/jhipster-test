jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LicenseService } from '../service/license.service';
import { ILicense, License } from '../license.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

import { LicenseUpdateComponent } from './license-update.component';

describe('Component Tests', () => {
  describe('License Management Update Component', () => {
    let comp: LicenseUpdateComponent;
    let fixture: ComponentFixture<LicenseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let licenseService: LicenseService;
    let invoiceService: InvoiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LicenseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LicenseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LicenseUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      licenseService = TestBed.inject(LicenseService);
      invoiceService = TestBed.inject(InvoiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call invoice query and add missing value', () => {
        const license: ILicense = { id: 456 };
        const invoice: IInvoice = { id: 10595 };
        license.invoice = invoice;

        const invoiceCollection: IInvoice[] = [{ id: 74117 }];
        jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
        const expectedCollection: IInvoice[] = [invoice, ...invoiceCollection];
        jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ license });
        comp.ngOnInit();

        expect(invoiceService.query).toHaveBeenCalled();
        expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(invoiceCollection, invoice);
        expect(comp.invoicesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const license: ILicense = { id: 456 };
        const invoice: IInvoice = { id: 24605 };
        license.invoice = invoice;

        activatedRoute.data = of({ license });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(license));
        expect(comp.invoicesCollection).toContain(invoice);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<License>>();
        const license = { id: 123 };
        jest.spyOn(licenseService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ license });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: license }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(licenseService.update).toHaveBeenCalledWith(license);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<License>>();
        const license = new License();
        jest.spyOn(licenseService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ license });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: license }));
        saveSubject.complete();

        // THEN
        expect(licenseService.create).toHaveBeenCalledWith(license);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<License>>();
        const license = { id: 123 };
        jest.spyOn(licenseService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ license });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(licenseService.update).toHaveBeenCalledWith(license);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackInvoiceById', () => {
        it('Should return tracked Invoice primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackInvoiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
