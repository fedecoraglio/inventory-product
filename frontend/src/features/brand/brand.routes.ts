import { Routes } from '@angular/router';

import { BrandComponent } from '@features/brand/brand.component';
import { BrandFormComponent } from '@features/brand/form/brand-form.component';


export const brandRoutes: Routes = [
  {
    path: '',
    component: BrandComponent,
  },
  {
    path: 'new',
    component: BrandFormComponent,
  },
  {
    path: ':brandId',
    component: BrandFormComponent,
  },
];
