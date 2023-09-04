import { Injectable, computed, signal } from '@angular/core';
import { RoutePaths } from '../../app.routes-path';

export type NavigationItem = Readonly<{
  order: number;
  link: RoutePaths;
  icon: string;
  text: string;
  showOnSideNav: boolean;
}>;

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly _navigationItemsSignal = signal<NavigationItem[]>(this.createNavigationItem());

  readonly navigationItemsSignal = computed(() => this._navigationItemsSignal());

  readonly navigationItemsNavSignal = computed(() =>
    this._navigationItemsSignal().filter(item => item.showOnSideNav),
  );

  private createNavigationItem() {
    return [
      {
        order: 1,
        link: RoutePaths.Home,
        icon: 'home',
        text: 'Home',
        showOnSideNav: true,
      },
      {
        order: 2,
        link: RoutePaths.Categories,
        icon: 'list',
        text: 'Categories',

        showOnSideNav: false,
      },
      {
        order: 3,
        link: RoutePaths.Products,
        icon: 'vertical_shades_closed',
        text: 'Products',

        showOnSideNav: true,
      },
      {
        order: 4,
        link: RoutePaths.Brands,
        icon: 'branding_watermark',
        text: 'Brands',

        showOnSideNav: false,
      },
      {
        order: 5,
        link: RoutePaths.Suppliers,
        icon: 'people',
        text: 'Suppliers',
        showOnSideNav: false,
      },
      {
        order: 6,
        link: RoutePaths.Purchases,
        icon: 'shopping_bag',
        text: 'Purchases',
        showOnSideNav: true,
      },
      {
        order: 7,
        link: RoutePaths.Colors,
        icon: 'colorize',
        text: 'Colors',
        showOnSideNav: false,
      },
    ];
  }
}
