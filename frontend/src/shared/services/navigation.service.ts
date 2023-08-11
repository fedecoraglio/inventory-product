import { Injectable, computed, signal } from '@angular/core';
import { RoutePaths } from '../../app.routes-path';

export type NavigationItem = Readonly<{
  order: number;
  link: RoutePaths;
  icon: string;
  text: string;
}>;

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly _navigationItemsSignal = signal<NavigationItem[]>(
    this.createNavigationItem(),
  );

  readonly navigationItemsSignal = computed(() =>
    this._navigationItemsSignal(),
  );

  private createNavigationItem() {
    return [
      {
        order: 1,
        link: RoutePaths.Home,
        icon: 'home',
        text: 'Home',
      },
      {
        order: 2,
        link: RoutePaths.Categories,
        icon: 'list',
        text: 'Categories',
      },
      {
        order: 3,
        link: RoutePaths.Products,
        icon: 'vertical_shades_closed',
        text: 'Products',
      },
      {
        order: 4,
        link: RoutePaths.Brands,
        icon: 'branding_watermark',
        text: 'Brands',
      },
    ];
  }
}
