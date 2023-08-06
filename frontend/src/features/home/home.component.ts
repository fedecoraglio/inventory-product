import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

import { RoutePaths } from '../../app.routes-path';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatGridListModule, RouterModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly route = inject(Router);

  gotToCategories() {
    this.route.navigate([`/${RoutePaths.Categories}`]);
  }
}
