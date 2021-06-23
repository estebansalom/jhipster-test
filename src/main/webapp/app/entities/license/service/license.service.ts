import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILicense, getLicenseIdentifier } from '../license.model';

export type EntityResponseType = HttpResponse<ILicense>;
export type EntityArrayResponseType = HttpResponse<ILicense[]>;

@Injectable({ providedIn: 'root' })
export class LicenseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/licenses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(license: ILicense): Observable<EntityResponseType> {
    return this.http.post<ILicense>(this.resourceUrl, license, { observe: 'response' });
  }

  update(license: ILicense): Observable<EntityResponseType> {
    return this.http.put<ILicense>(`${this.resourceUrl}/${getLicenseIdentifier(license) as number}`, license, { observe: 'response' });
  }

  partialUpdate(license: ILicense): Observable<EntityResponseType> {
    return this.http.patch<ILicense>(`${this.resourceUrl}/${getLicenseIdentifier(license) as number}`, license, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILicense>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILicense[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLicenseToCollectionIfMissing(licenseCollection: ILicense[], ...licensesToCheck: (ILicense | null | undefined)[]): ILicense[] {
    const licenses: ILicense[] = licensesToCheck.filter(isPresent);
    if (licenses.length > 0) {
      const licenseCollectionIdentifiers = licenseCollection.map(licenseItem => getLicenseIdentifier(licenseItem)!);
      const licensesToAdd = licenses.filter(licenseItem => {
        const licenseIdentifier = getLicenseIdentifier(licenseItem);
        if (licenseIdentifier == null || licenseCollectionIdentifiers.includes(licenseIdentifier)) {
          return false;
        }
        licenseCollectionIdentifiers.push(licenseIdentifier);
        return true;
      });
      return [...licensesToAdd, ...licenseCollection];
    }
    return licenseCollection;
  }
}
