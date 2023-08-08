import {
  EMPTY,
  Observable,
  catchError,
  filter,
  finalize,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';
import { SnackBarService } from '../../../shared/snack-bar/snack-bar.service';
import { ProductApiService } from '../api/product-api.service';
import { ProductDto, ProductListDto, ProductPaginationDto } from '../types/product.types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productApiService = inject(ProductApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _productsSignal = signal<ProductDto[]>([]);
  private readonly _productSignal = signal<ProductDto>(null);
  private readonly _countSignal = signal<number>(0);
  private readonly _isLoadingSignal = signal<boolean>(false);
  // Immutable signal
  readonly productsSignal = computed(() => this._productsSignal() ?? []);
  readonly productSignal = computed(() => this._productSignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());
  readonly isLoadingSignal = computed(() => this._isLoadingSignal());

  getAll$(appendData = false): Observable<ProductListDto> {
    this._isLoadingSignal.set(true);
    let param: ProductPaginationDto = { limit: 10 };

    return this.productApiService.getAll$(param).pipe(
      take(1),
      tap(({ items, count }) => {
        if (appendData) {
          const currentItems = this._productsSignal();
          currentItems.push(...items);
          this._productsSignal.set(currentItems);
        } else {
          this._productsSignal.set(items);
        }

        this._countSignal.set(count);
      }),
      finalize(() => {
        this._isLoadingSignal.set(false);
      }),
    );
  }

  getById$(id: string): Observable<ProductDto> {
    return this.productApiService.getById$(id).pipe(
      tap(product => {
        this._productSignal.set(product);
      }),
    );
  }

  save$(dto: ProductDto): Observable<ProductDto> {
    this._isLoadingSignal.set(true);
    return this.productApiService.save$(dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() => this._isLoadingSignal.set(false)),
    );
  }

  update$(id: string, dto: ProductDto): Observable<ProductDto> {
    this._isLoadingSignal.update(isLoading => (isLoading = true));
    return this.productApiService.update$(id, dto).pipe(
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);

        return EMPTY;
      }),
      finalize(() =>
        this._isLoadingSignal.update(isLoading => (isLoading = false)),
      ),
    );
  }

  delete$(id: string): Observable<ProductDto> {
    this._isLoadingSignal.update(isLoading => (isLoading = true));
    return this.confirmationService
      .open$({
        text: 'Are you sure you want to remove this product?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      })
      .pipe(
        filter((isConfirm: boolean) => isConfirm),
        switchMap(() => {
          return this.productApiService.delete$(id).pipe(
            switchMap(dto => {
              if (this.snackBarService) {
                this.snackBarService.showMessage(
                  'Product deleted successfully',
                );
              }
              return this.getAll$().pipe(switchMap(() => of(dto)));
            }),
            catchError((e: HttpErrorResponse) => {
              if (this.snackBarService) {
                this.snackBarService.showError(
                  `Error deleting product: ${e.message}`,
                );
              }

              return EMPTY;
            }),
          );
        }),
        finalize(() => this._isLoadingSignal.set(false)),
      );
  }
}
