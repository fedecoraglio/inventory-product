import {
  EMPTY,
  Observable,
  catchError,
  filter,
  finalize,
  map,
  of,
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
} from '../types/category.types';
import { CategoryApiService } from '../api/category-api.service';
import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryApiService = inject(CategoryApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _categoriesSignal = signal<CategoryDto[]>([]);
  private readonly _categorySignal = signal<CategoryDto>(null);
  private readonly _countSignal = signal<number>(0);
  private readonly _isLoadingSignal = signal<boolean>(false);
  // Immutable signal
  readonly categoriesSignal = computed(() => this._categoriesSignal() ?? []);
  readonly categorySignal = computed(() => this._categorySignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());
  readonly isLoadingSignal = computed(() => this._isLoadingSignal());

  getAll$(appendData = false): Observable<CategoryListDto> {
    this._isLoadingSignal.set(true);
    let param: CategoryPaginationDto = { limit: 10 };

    return this.categoryApiService.getAll$(param).pipe(
      take(1),
      tap(({ items, count }) => {
        if (appendData) {
          const currentItems = this._categoriesSignal();
          currentItems.push(...items);
          this._categoriesSignal.set(currentItems);
        } else {
          this._categoriesSignal.set(items);
        }

        this._countSignal.set(count);
      }),
      finalize(() => {
        this._isLoadingSignal.set(false);
      }),
    );
  }

  getById$(id: string): Observable<CategoryDto> {
    return this.categoryApiService.getById$(id).pipe(
      tap(category => {
        this._categorySignal.set(category);
      }),
    );
  }

  save$(dto: CategoryDto): Observable<CategoryDto> {
    this._isLoadingSignal.set(true);
    return this.categoryApiService.save$(dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() => this._isLoadingSignal.set(false)),
    );
  }

  update$(id: string, dto: CategoryDto): Observable<CategoryDto> {
    this._isLoadingSignal.update(isLoading => (isLoading = true));
    return this.categoryApiService.update$(id, dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() =>
        this._isLoadingSignal.update(isLoading => (isLoading = false)),
      ),
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
