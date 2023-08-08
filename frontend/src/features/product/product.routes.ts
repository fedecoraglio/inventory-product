import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './form/product-form.component';

export const productRoutes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
  {
    path: 'new',
    component: ProductFormComponent,
  },
  {
    path: ':productId',
    component: ProductFormComponent,
  },
];
