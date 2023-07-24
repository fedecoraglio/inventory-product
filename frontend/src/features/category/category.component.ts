import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { CategoryService } from './services/category.service';
import { CategoryListComponent } from './list/category-list.component';
import { RoutePaths } from '../../app.routes-path';
import { CategoryPaginationComponent } from './pagination/category-pagination.component';
import { CategoryPaginationDto } from './types/category.types';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    CategoryPaginationComponent,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    NgIf,
  ],
  providers: [CategoryService],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly listCategories$ = new Subject<boolean>();
  readonly categoriesSignal = this.categoryService.categoriesSignal;
  // TODO: pagination is pending.
  readonly countSignal = this.categoryService.countSignal;
  readonly lastEvaluatedKeySignal = this.categoryService.lastEvaluatedKeySignal;
  readonly isLoadingSignal = this.categoryService.isLoadingSignal

  ngOnInit() {
    this.listCategories$
      .pipe(
        switchMap(showMore => this.categoryService.getAll$(showMore)),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.showCategories(false);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToNewCategory() {
    this.route.navigate([`/${RoutePaths.Categories}/new`]);
  }

  showCategories(showMore: boolean) {
    this.listCategories$.next(showMore);
  }
}
