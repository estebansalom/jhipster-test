import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILicense, License } from '../license.model';

import { LicenseService } from './license.service';

describe('Service Tests', () => {
  describe('License Service', () => {
    let service: LicenseService;
    let httpMock: HttpTestingController;
    let elemDefault: ILicense;
    let expectedResult: ILicense | ILicense[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LicenseService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
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

      it('should create a License', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new License()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a License', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a License', () => {
        const patchObject = Object.assign({}, new License());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of License', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a License', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLicenseToCollectionIfMissing', () => {
        it('should add a License to an empty array', () => {
          const license: ILicense = { id: 123 };
          expectedResult = service.addLicenseToCollectionIfMissing([], license);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(license);
        });

        it('should not add a License to an array that contains it', () => {
          const license: ILicense = { id: 123 };
          const licenseCollection: ILicense[] = [
            {
              ...license,
            },
            { id: 456 },
          ];
          expectedResult = service.addLicenseToCollectionIfMissing(licenseCollection, license);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a License to an array that doesn't contain it", () => {
          const license: ILicense = { id: 123 };
          const licenseCollection: ILicense[] = [{ id: 456 }];
          expectedResult = service.addLicenseToCollectionIfMissing(licenseCollection, license);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(license);
        });

        it('should add only unique License to an array', () => {
          const licenseArray: ILicense[] = [{ id: 123 }, { id: 456 }, { id: 98873 }];
          const licenseCollection: ILicense[] = [{ id: 123 }];
          expectedResult = service.addLicenseToCollectionIfMissing(licenseCollection, ...licenseArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const license: ILicense = { id: 123 };
          const license2: ILicense = { id: 456 };
          expectedResult = service.addLicenseToCollectionIfMissing([], license, license2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(license);
          expect(expectedResult).toContain(license2);
        });

        it('should accept null and undefined values', () => {
          const license: ILicense = { id: 123 };
          expectedResult = service.addLicenseToCollectionIfMissing([], null, license, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(license);
        });

        it('should return initial array if no License is added', () => {
          const licenseCollection: ILicense[] = [{ id: 123 }];
          expectedResult = service.addLicenseToCollectionIfMissing(licenseCollection, undefined, null);
          expect(expectedResult).toEqual(licenseCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
