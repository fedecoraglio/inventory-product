import { Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryFormComponent } from './form/category-form.component';

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoryComponent,
  },
  {
    path: 'new',
    component: CategoryFormComponent,
  },
  {
    path: ':categoryId',
    component: CategoryFormComponent,
  },
];
