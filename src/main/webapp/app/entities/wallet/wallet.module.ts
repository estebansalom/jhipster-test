import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WalletComponent } from './list/wallet.component';
import { WalletDetailComponent } from './detail/wallet-detail.component';
import { WalletUpdateComponent } from './update/wallet-update.component';
import { WalletDeleteDialogComponent } from './delete/wallet-delete-dialog.component';
import { WalletRoutingModule } from './route/wallet-routing.module';

@NgModule({
  imports: [SharedModule, WalletRoutingModule],
  declarations: [WalletComponent, WalletDetailComponent, WalletUpdateComponent, WalletDeleteDialogComponent],
  entryComponents: [WalletDeleteDialogComponent],
})
export class WalletModule {}
