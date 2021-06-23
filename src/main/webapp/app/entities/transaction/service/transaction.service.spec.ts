import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITransaction, Transaction } from '../transaction.model';

import { TransactionService } from './transaction.service';

describe('Service Tests', () => {
  describe('Transaction Service', () => {
    let service: TransactionService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransaction;
    let expectedResult: ITransaction | ITransaction[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TransactionService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        name: 'AAAAAAA',
        description: 'AAAAAAA',
        date: currentDate,
        amount: 0,
        type: 'AAAAAAA',
        periodic: false,
        id: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Transaction', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Transaction()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Transaction', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            description: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
            amount: 1,
            type: 'BBBBBB',
            periodic: true,
            id: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Transaction', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
            amount: 1,
            type: 'BBBBBB',
            periodic: true,
          },
          new Transaction()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Transaction', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            description: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
            amount: 1,
            type: 'BBBBBB',
            periodic: true,
            id: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Transaction', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTransactionToCollectionIfMissing', () => {
        it('should add a Transaction to an empty array', () => {
          const transaction: ITransaction = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addTransactionToCollectionIfMissing([], transaction);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transaction);
        });

        it('should not add a Transaction to an array that contains it', () => {
          const transaction: ITransaction = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const transactionCollection: ITransaction[] = [
            {
              ...transaction,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addTransactionToCollectionIfMissing(transactionCollection, transaction);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Transaction to an array that doesn't contain it", () => {
          const transaction: ITransaction = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const transactionCollection: ITransaction[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addTransactionToCollectionIfMissing(transactionCollection, transaction);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transaction);
        });

        it('should add only unique Transaction to an array', () => {
          const transactionArray: ITransaction[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'ca4b158f-b228-4141-940d-ed027e3db1ee' },
          ];
          const transactionCollection: ITransaction[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addTransactionToCollectionIfMissing(transactionCollection, ...transactionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const transaction: ITransaction = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const transaction2: ITransaction = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addTransactionToCollectionIfMissing([], transaction, transaction2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transaction);
          expect(expectedResult).toContain(transaction2);
        });

        it('should accept null and undefined values', () => {
          const transaction: ITransaction = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addTransactionToCollectionIfMissing([], null, transaction, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transaction);
        });

        it('should return initial array if no Transaction is added', () => {
          const transactionCollection: ITransaction[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addTransactionToCollectionIfMissing(transactionCollection, undefined, null);
          expect(expectedResult).toEqual(transactionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
