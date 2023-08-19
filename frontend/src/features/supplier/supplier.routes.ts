import { Routes } from '@angular/router';

import { SupplierComponent } from '@features/supplier/supplier.component';
import { SupplierFormComponent } from '@features/supplier/form/supplier-form.component';


export const supplierRoutes: Routes = [
  {
    path: '',
    component: SupplierComponent,
  },
  {
    path: 'new',
    component: SupplierFormComponent,
  },
  {
    path: ':supplierId',
    component: SupplierFormComponent,
  },
];
