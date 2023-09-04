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
import { LoadingService } from '@shared/services/loading.service';
import { ColorApiService } from '@features/color/api/color-api.service';
import { ColorDto, ColorListDto } from '@features/color/types/color.types';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private readonly colorApiService = inject(ColorApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _colorsSignal = signal<ColorDto[]>([]);
  private readonly _colorSignal = signal<ColorDto>(null);
  private readonly _countSignal = signal<number>(0);
  // Immutable signal
  readonly colorsSignal = computed(() => this._colorsSignal() ?? []);
  readonly colorSignal = computed(() => this._colorSignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());

  getAll$(): Observable<ColorListDto> {
    this.loadingService.showProcessBar();

    return this.colorApiService.getAll$().pipe(
      take(1),
      tap(({ items, count }) => {
        this._colorsSignal.set(items);
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

  getById$(id: string): Observable<ColorDto> {
    return this.colorApiService.getById$(id).pipe(
      tap(brand => {
        this._colorSignal.set(brand);
      }),
      catchError(() => {
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  save$(dto: ColorDto): Observable<ColorDto> {
    return this.colorApiService.save$(dto).pipe(
      take(1),
      map(newBrand => {
        this._colorsSignal.mutate(items => items.unshift(newBrand));
        return newBrand;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  update$(id: string, dto: ColorDto): Observable<ColorDto> {
    return this.colorApiService.update$(id, dto).pipe(
      take(1),
      map(editBrand => {
        this._colorsSignal.update(items =>
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

  delete$(id: string): Observable<ColorDto> {
    return this.confirmationService
      .open$({
        text: 'Are you sure you want to remove this brand?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => {
          return this.colorApiService.delete$(id).pipe(
            map(dto => {
              if (this.snackBarService) {
                this.snackBarService.showMessage('Color deleted successfully');
              }
              this._colorsSignal.update(colors => colors.filter(item => item.id !== dto.id));
              return dto;
            }),
            catchError((e: HttpErrorResponse) => {
              if (this.snackBarService) {
                this.snackBarService.showError(`${e.error?.message ?? 'Error deleting color'} `);
              }
              this.loadingService.hideProcessBar();
              return EMPTY;
            }),
          );
        }),
      );
  }
}
