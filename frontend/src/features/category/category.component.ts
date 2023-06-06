import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

import { CategoryService } from './services/category.service';
import { CategoryListComponent } from './list/category-list.component';
import { RoutePaths } from '../../app.routes-path';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    NgIf,
  ],
  providers: [CategoryService],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(Router);
  readonly categoriesSignal = this.categoryService.categoriesSignal;
  // TODO: pagination is pending.
  readonly countSignal = this.categoryService.countSignal;
  readonly lastEvaluateKeySignal = this.categoryService.lastEvaluateKeySignal;

  constructor() {
    this.loadCategory();
  }

  goToNewCategory() {
    this.route.navigate([`/${RoutePaths.Categories}/new`]);
  }

  private loadCategory() {
    this.categoryService.getAll$().pipe(takeUntilDestroyed()).subscribe();
  }
}
