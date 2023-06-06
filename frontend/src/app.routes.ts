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
          import('./features/home/home.routes').then(
            ({ homeRoutes }) => homeRoutes,
          ),
      },
      {
        path: RoutePaths.Categories,
        loadChildren: () =>
          import('./features/category/category.routes').then(
            ({ categoryRoutes }) => categoryRoutes,
          ),
      },
    ],
  },
];
