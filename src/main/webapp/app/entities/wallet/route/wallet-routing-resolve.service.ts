import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWallet, Wallet } from '../wallet.model';
import { WalletService } from '../service/wallet.service';

@Injectable({ providedIn: 'root' })
export class WalletRoutingResolveService implements Resolve<IWallet> {
  constructor(protected service: WalletService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWallet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((wallet: HttpResponse<Wallet>) => {
          if (wallet.body) {
            return of(wallet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Wallet());
  }
}
