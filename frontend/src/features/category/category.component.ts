import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EMPTY, Subject, delay, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CategoryService } from '@features/category/services/category.service';
import { CategoryListComponent } from '@features/category/list/category-list.component';
import { LoadingService } from '@shared/services/loading.service';
import { CategoryAddComponent } from '@features/category/add/category-add.component';

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
export class CategoryComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  private readonly listCategories$ = new Subject<void>();
  readonly categoriesSignal = this.categoryService.categoriesSignal;
  // TODO: pagination is pending.
  readonly countSignal = this.categoryService.countSignal;
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  ngOnInit() {
    this.listCategories$
      .pipe(
        switchMap(() => this.categoryService.getAll$()),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.listCategories$.next();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  executeNewBrand() {
    this.matDialog
      .open(CategoryAddComponent, {
        disableClose: true,
        width: '600px',
        data: null,
      })
      .afterClosed()
      .pipe(
        tap(() => this.loadingService.showProcessBar()),
        delay(0),
        switchMap(data => {
          if (data) {
            return this.categoryService.save$(data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
        finalize(() => this.loadingService.hideProcessBar()),
      )
      .subscribe();
  }
}
