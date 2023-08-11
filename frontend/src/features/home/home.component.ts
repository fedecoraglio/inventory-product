import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

import { RoutePaths } from '../../app.routes-path';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../shared/services/navigation.service';
import { HomeProductCardComponent } from './home-product-card/home-product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    HomeProductCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly route = inject(Router);
  private readonly navigationService = inject(NavigationService);
  readonly navigationItemsSignal = this.navigationService.navigationItemsSignal;

  gotToPage(path: RoutePaths) {
    this.route.navigate([`/${path}`]);
  }
}
