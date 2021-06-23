import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-details',
        data: { pageTitle: 'testApp.userDetails.home.title' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'wallet',
        data: { pageTitle: 'testApp.wallet.home.title' },
        loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'testApp.transaction.home.title' },
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      },
      {
        path: 'attachment',
        data: { pageTitle: 'testApp.attachment.home.title' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'testApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'testApp.invoice.home.title' },
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'testApp.contact.home.title' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'currency',
        data: { pageTitle: 'testApp.currency.home.title' },
        loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule),
      },
      {
        path: 'icon',
        data: { pageTitle: 'testApp.icon.home.title' },
        loadChildren: () => import('./icon/icon.module').then(m => m.IconModule),
      },
      {
        path: 'license',
        data: { pageTitle: 'testApp.license.home.title' },
        loadChildren: () => import('./license/license.module').then(m => m.LicenseModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
