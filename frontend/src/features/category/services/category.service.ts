import {
  EMPTY,
  Observable,
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  CategoryDto,
  CategoryListDto,
  CategoryPaginationDto,
} from '@features/category/types/category.types';
import { CategoryApiService } from '@features/category/api/category-api.service';
import { ConfirmationService } from '@shared/confirmation/confirmation.service';
import { SnackBarService } from '@shared/snack-bar/snack-bar.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryApiService = inject(CategoryApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _categoriesSignal = signal<CategoryDto[]>([]);
  private readonly _categorySignal = signal<CategoryDto>(null);
  private readonly _countSignal = signal<number>(0);
  // Immutable signal
  readonly categoriesSignal = computed(() => this._categoriesSignal() ?? []);
  readonly categorySignal = computed(() => this._categorySignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());

  getAll$(): Observable<CategoryListDto> {
    this.loadingService.showProcessBar();

    return this.categoryApiService.getAll$().pipe(
      take(1),
      tap(({ items, count }) => {
        this._categoriesSignal.set(items);
        this._countSignal.set(count);
      }),
      catchError(() => {
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
      finalize(() => {
        this.loadingService.hideProcessBar();
      }),
    );
  }

  getById$(id: string): Observable<CategoryDto> {
    return this.categoryApiService.getById$(id).pipe(
      tap(category => {
        this._categorySignal.set(category);
      }),
      catchError(() => {
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  save$(dto: CategoryDto): Observable<CategoryDto> {
    return this.categoryApiService.save$(dto).pipe(
      take(1),
      map(newCategory => {
        this._categoriesSignal.mutate(items => items.unshift(newCategory));
        return newCategory;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();

        return EMPTY;
      }),
    );
  }

  update$(id: string, dto: CategoryDto): Observable<CategoryDto> {
    return this.categoryApiService.update$(id, dto).pipe(
      take(1),
      map(editCategory => {
        this._categoriesSignal.update(items =>
          items.map(item => (item.id === id ? { ...editCategory } : item)),
        );
        return editCategory;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();

        return EMPTY;
      }),
    );
  }

  delete$(categoryId: string): Observable<CategoryDto> {
    return this.confirmationService
      .open$({
        text: 'Are you sure you want to remove this category?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      })
      .pipe(
        filter((isConfirm: boolean) => isConfirm),
        switchMap(() => {
          return this.categoryApiService.delete$(categoryId).pipe(
            map(dto => {
              if (this.snackBarService) {
                this.snackBarService.showMessage(
                  'Category deleted successfully',
                );
              }
              this._categoriesSignal.update(items =>
                items.filter(item => item.id !== dto.id),
              );
              return dto;
            }),
            catchError((e: HttpErrorResponse) => {
              if (this.snackBarService) {
                this.snackBarService.showError(
                  `Error deleting category: ${e.message}`,
                );
              }

              return EMPTY;
            }),
          );
        }),
      );
  }
}
