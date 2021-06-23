import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWallet, getWalletIdentifier } from '../wallet.model';

export type EntityResponseType = HttpResponse<IWallet>;
export type EntityArrayResponseType = HttpResponse<IWallet[]>;

@Injectable({ providedIn: 'root' })
export class WalletService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/wallets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(wallet: IWallet): Observable<EntityResponseType> {
    return this.http.post<IWallet>(this.resourceUrl, wallet, { observe: 'response' });
  }

  update(wallet: IWallet): Observable<EntityResponseType> {
    return this.http.put<IWallet>(`${this.resourceUrl}/${getWalletIdentifier(wallet) as number}`, wallet, { observe: 'response' });
  }

  partialUpdate(wallet: IWallet): Observable<EntityResponseType> {
    return this.http.patch<IWallet>(`${this.resourceUrl}/${getWalletIdentifier(wallet) as number}`, wallet, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWallet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWallet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWalletToCollectionIfMissing(walletCollection: IWallet[], ...walletsToCheck: (IWallet | null | undefined)[]): IWallet[] {
    const wallets: IWallet[] = walletsToCheck.filter(isPresent);
    if (wallets.length > 0) {
      const walletCollectionIdentifiers = walletCollection.map(walletItem => getWalletIdentifier(walletItem)!);
      const walletsToAdd = wallets.filter(walletItem => {
        const walletIdentifier = getWalletIdentifier(walletItem);
        if (walletIdentifier == null || walletCollectionIdentifiers.includes(walletIdentifier)) {
          return false;
        }
        walletCollectionIdentifiers.push(walletIdentifier);
        return true;
      });
      return [...walletsToAdd, ...walletCollection];
    }
    return walletCollection;
  }
}
