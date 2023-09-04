import { Routes } from '@angular/router';
import { PurchaseComponent } from '@features/purchase/purchase.component';
import { PurchaseCreateComponent } from './create/purchase-create.component';

export const purchaseRoutes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
  },
  {
    path: 'new',
    component: PurchaseCreateComponent,
  },
];
