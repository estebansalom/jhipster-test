import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWallet, Wallet } from '../wallet.model';

import { WalletService } from './wallet.service';

describe('Service Tests', () => {
  describe('Wallet Service', () => {
    let service: WalletService;
    let httpMock: HttpTestingController;
    let elemDefault: IWallet;
    let expectedResult: IWallet | IWallet[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(WalletService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        description: 'AAAAAAA',
        currency: 'AAAAAAA',
        initialBalance: 0,
        inReports: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Wallet', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Wallet()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Wallet', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
            currency: 'BBBBBB',
            initialBalance: 1,
            inReports: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Wallet', () => {
        const patchObject = Object.assign(
          {
            currency: 'BBBBBB',
            initialBalance: 1,
            inReports: true,
          },
          new Wallet()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Wallet', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
            currency: 'BBBBBB',
            initialBalance: 1,
            inReports: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Wallet', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addWalletToCollectionIfMissing', () => {
        it('should add a Wallet to an empty array', () => {
          const wallet: IWallet = { id: 123 };
          expectedResult = service.addWalletToCollectionIfMissing([], wallet);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(wallet);
        });

        it('should not add a Wallet to an array that contains it', () => {
          const wallet: IWallet = { id: 123 };
          const walletCollection: IWallet[] = [
            {
              ...wallet,
            },
            { id: 456 },
          ];
          expectedResult = service.addWalletToCollectionIfMissing(walletCollection, wallet);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Wallet to an array that doesn't contain it", () => {
          const wallet: IWallet = { id: 123 };
          const walletCollection: IWallet[] = [{ id: 456 }];
          expectedResult = service.addWalletToCollectionIfMissing(walletCollection, wallet);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(wallet);
        });

        it('should add only unique Wallet to an array', () => {
          const walletArray: IWallet[] = [{ id: 123 }, { id: 456 }, { id: 37041 }];
          const walletCollection: IWallet[] = [{ id: 123 }];
          expectedResult = service.addWalletToCollectionIfMissing(walletCollection, ...walletArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const wallet: IWallet = { id: 123 };
          const wallet2: IWallet = { id: 456 };
          expectedResult = service.addWalletToCollectionIfMissing([], wallet, wallet2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(wallet);
          expect(expectedResult).toContain(wallet2);
        });

        it('should accept null and undefined values', () => {
          const wallet: IWallet = { id: 123 };
          expectedResult = service.addWalletToCollectionIfMissing([], null, wallet, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(wallet);
        });

        it('should return initial array if no Wallet is added', () => {
          const walletCollection: IWallet[] = [{ id: 123 }];
          expectedResult = service.addWalletToCollectionIfMissing(walletCollection, undefined, null);
          expect(expectedResult).toEqual(walletCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
