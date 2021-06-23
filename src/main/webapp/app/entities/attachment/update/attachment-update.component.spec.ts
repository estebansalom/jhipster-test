jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AttachmentService } from '../service/attachment.service';
import { IAttachment, Attachment } from '../attachment.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';

import { AttachmentUpdateComponent } from './attachment-update.component';

describe('Component Tests', () => {
  describe('Attachment Management Update Component', () => {
    let comp: AttachmentUpdateComponent;
    let fixture: ComponentFixture<AttachmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let attachmentService: AttachmentService;
    let transactionService: TransactionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AttachmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AttachmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AttachmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      attachmentService = TestBed.inject(AttachmentService);
      transactionService = TestBed.inject(TransactionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Transaction query and add missing value', () => {
        const attachment: IAttachment = { id: 456 };
        const transaction: ITransaction = { id: 'ae592aef-b224-4981-96d3-67a7e66b9294' };
        attachment.transaction = transaction;

        const transactionCollection: ITransaction[] = [{ id: '6dfe8e4a-3a8d-49fe-a79b-696b1e02938e' }];
        jest.spyOn(transactionService, 'query').mockReturnValue(of(new HttpResponse({ body: transactionCollection })));
        const additionalTransactions = [transaction];
        const expectedCollection: ITransaction[] = [...additionalTransactions, ...transactionCollection];
        jest.spyOn(transactionService, 'addTransactionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        expect(transactionService.query).toHaveBeenCalled();
        expect(transactionService.addTransactionToCollectionIfMissing).toHaveBeenCalledWith(
          transactionCollection,
          ...additionalTransactions
        );
        expect(comp.transactionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const attachment: IAttachment = { id: 456 };
        const transaction: ITransaction = { id: '69150dac-3bc3-4315-bad9-500927d0dfbf' };
        attachment.transaction = transaction;

        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(attachment));
        expect(comp.transactionsSharedCollection).toContain(transaction);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Attachment>>();
        const attachment = { id: 123 };
        jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attachment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(attachmentService.update).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Attachment>>();
        const attachment = new Attachment();
        jest.spyOn(attachmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: attachment }));
        saveSubject.complete();

        // THEN
        expect(attachmentService.create).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Attachment>>();
        const attachment = { id: 123 };
        jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ attachment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(attachmentService.update).toHaveBeenCalledWith(attachment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTransactionById', () => {
        it('Should return tracked Transaction primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackTransactionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
