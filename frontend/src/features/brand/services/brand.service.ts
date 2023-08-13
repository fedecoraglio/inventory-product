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

import { ConfirmationService } from '@shared/confirmation/confirmation.service';
import { SnackBarService } from '@shared/snack-bar/snack-bar.service';
import { BrandApiService } from '@features/brand/api/brand-api.service';
import { BrandDto, BrandListDto } from '@features/brand/types/brand.types';
import { LoadingService } from '@shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly brandApiService = inject(BrandApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _brandsSignal = signal<BrandDto[]>([]);
  private readonly _brandSignal = signal<BrandDto>(null);
  private readonly _countSignal = signal<number>(0);
  // Immutable signal
  readonly brandsSignal = computed(() => this._brandsSignal() ?? []);
  readonly brandSignal = computed(() => this._brandSignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());

  getAll$(): Observable<BrandListDto> {
    this.loadingService.showProcessBar();

    return this.brandApiService.getAll$().pipe(
      take(1),
      tap(({ items, count }) => {
        this._brandsSignal.set(items);
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

  getById$(id: string): Observable<BrandDto> {
    return this.brandApiService.getById$(id).pipe(
      tap(brand => {
        this._brandSignal.set(brand);
      }),
      catchError(() => {
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  save$(dto: BrandDto): Observable<BrandDto> {
    return this.brandApiService.save$(dto).pipe(
      take(1),
      map(newBrand => {
        this._brandsSignal.mutate(items => items.unshift(newBrand));
        return newBrand;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  update$(id: string, dto: BrandDto): Observable<BrandDto> {
    return this.brandApiService.update$(id, dto).pipe(
      take(1),
      map(editBrand => {
        this._brandsSignal.update(items =>
          items.map(item => (item.id === id ? { ...editBrand } : item)),
        );
        return editBrand;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  delete$(id: string): Observable<BrandDto> {
    return this.confirmationService
      .open$({
        text: 'Are you sure you want to remove this brand?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => {
          return this.brandApiService.delete$(id).pipe(
            map(dto => {
              if (this.snackBarService) {
                this.snackBarService.showMessage('Brand deleted successfully');
              }
              this._brandsSignal.update(brands =>
                brands.filter(brand => brand.id !== dto.id),
              );
              return dto;
            }),
            catchError((e: HttpErrorResponse) => {
              if (this.snackBarService) {
                this.snackBarService.showError(
                  `${e.error?.message ?? 'Error deleting brand'} `,
                );
              }
              this.loadingService.hideProcessBar();
              return EMPTY;
            }),
          );
        }),
      );
  }
}
