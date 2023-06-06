import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  filter,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  Injectable,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { CategoryDto, CategoryListDto } from '../types/category.types';
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
  private readonly _lastEvaluateKeySignal = signal<string | null>(null);
  // Immutable signal
  readonly categoriesSignal = computed(() => this._categoriesSignal() ?? []);
  readonly categorySignal = computed(() => this._categorySignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());
  readonly isLoadingSignal = computed(() => this._isLoadingSignal());
  readonly lastEvaluateKeySignal = computed(() =>
    this._lastEvaluateKeySignal(),
  );

  getAll$(): Observable<CategoryListDto> {
    return this.categoryApiService.getAll$().pipe(
      tap(({ items, count, lastEvaluateKey }) => {
        this._categoriesSignal.set(items);
        this._countSignal.set(count);
        this._lastEvaluateKeySignal.set(lastEvaluateKey || null);
      }),
    );
  }

  getById$(id: string): Observable<CategoryDto> {
    return this.categoryApiService.getById$(id).pipe(
      tap((category) => {
        this._categorySignal.set(category);
      }),
    );
  }

  save$(dto: CategoryDto): Observable<CategoryDto> {
    this._isLoadingSignal.update((isLoading) => (isLoading = true));
    return this.categoryApiService.save$(dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() =>
        this._isLoadingSignal.update((isLoading) => (isLoading = false)),
      ),
    );
  }

  update$(id: string, dto: CategoryDto): Observable<CategoryDto> {
    this._isLoadingSignal.update((isLoading) => (isLoading = true));
    return this.categoryApiService.update$(id, dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() =>
        this._isLoadingSignal.update((isLoading) => (isLoading = false)),
      ),
    );
  }

  delete$(categoryId: string): Observable<CategoryDto> {
    this._isLoadingSignal.update((isLoading) => (isLoading = true));
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
            switchMap((categoryDto) => {
              if (this.snackBarService) {
                this.snackBarService.showMessage(
                  'Category deleted successfully',
                );
              }
              return this.getAll$().pipe(switchMap(() => of(categoryDto)));
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
        finalize(() =>
          this._isLoadingSignal.update((isLoading) => (isLoading = false)),
        ),
      );
  }
}
