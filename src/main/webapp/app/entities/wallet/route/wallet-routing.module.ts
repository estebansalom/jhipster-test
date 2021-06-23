import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WalletComponent } from '../list/wallet.component';
import { WalletDetailComponent } from '../detail/wallet-detail.component';
import { WalletUpdateComponent } from '../update/wallet-update.component';
import { WalletRoutingResolveService } from './wallet-routing-resolve.service';

const walletRoute: Routes = [
  {
    path: '',
    component: WalletComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WalletDetailComponent,
    resolve: {
      wallet: WalletRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WalletUpdateComponent,
    resolve: {
      wallet: WalletRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WalletUpdateComponent,
    resolve: {
      wallet: WalletRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(walletRoute)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
