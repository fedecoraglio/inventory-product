import { Routes } from '@angular/router';

import { RoutePaths } from './app.routes-path';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutePaths.Home,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: RoutePaths.Home,
        loadChildren: () =>
          import('./features/home/home.routes').then(({ homeRoutes }) => homeRoutes),
      },
      {
        path: RoutePaths.Categories,
        loadChildren: () =>
          import('./features/category/category.routes').then(
            ({ categoryRoutes }) => categoryRoutes,
          ),
      },
      {
        path: RoutePaths.Products,
        loadChildren: () =>
          import('./features/product/product.routes').then(({ productRoutes }) => productRoutes),
      },
      {
        path: RoutePaths.Brands,
        loadChildren: () =>
          import('./features/brand/brand.routes').then(({ brandRoutes }) => brandRoutes),
      },
      {
        path: RoutePaths.Suppliers,
        loadChildren: () =>
          import('./features/supplier/supplier.routes').then(
            ({ supplierRoutes }) => supplierRoutes,
          ),
      },
      {
        path: RoutePaths.Purchases,
        loadChildren: () =>
          import('./features/purchase/purchase.routes').then(
            ({ purchaseRoutes }) => purchaseRoutes,
          ),
      },
      {
        path: RoutePaths.Colors,
        loadChildren: () =>
          import('./features/color/color.routes').then(({ colorRoutes }) => colorRoutes),
      },
    ],
  },
];
