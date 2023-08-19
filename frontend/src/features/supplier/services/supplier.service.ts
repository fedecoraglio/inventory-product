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
import { SupplierApiService } from '@features/supplier/api/supplier-api.service';
import { SupplierDto, SupplierListDto } from '@features/supplier/types/supplier.types';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly supplierApiService = inject(SupplierApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackBarService = inject(SnackBarService);
  // WritableSignal
  private readonly _suppliersSignal = signal<SupplierDto[]>([]);
  private readonly _supplierSignal = signal<SupplierDto>(null);
  private readonly _countSignal = signal<number>(0);
  // Immutable signal
  readonly suppliersSignal = computed(() => this._suppliersSignal() ?? []);
  readonly supplierSignal = computed(() => this._supplierSignal() ?? null);
  readonly countSignal = computed(() => this._countSignal());

  getAll$(): Observable<SupplierListDto> {
    this.loadingService.showProcessBar();

    return this.supplierApiService.getAll$().pipe(
      take(1),
      tap(({ items, count }) => {
        this._suppliersSignal.set(items);
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

  getById$(id: string): Observable<SupplierDto> {
    return this.supplierApiService.getById$(id).pipe(
      tap(supplier => {
        this._supplierSignal.set(supplier);
      }),
      catchError(() => {
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  save$(dto: SupplierDto): Observable<SupplierDto> {
    return this.supplierApiService.save$(dto).pipe(
      take(1),
      map(newItem => {
        this._suppliersSignal.mutate(items => items.unshift(newItem));
        return newItem;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  update$(id: string, dto: SupplierDto): Observable<SupplierDto> {
    return this.supplierApiService.update$(id, dto).pipe(
      take(1),
      map(editItem => {
        this._suppliersSignal.update(items =>
          items.map(item => (item.id === id ? { ...editItem } : item)),
        );
        return editItem;
      }),
      catchError(({ error }) => {
        this.snackBarService.showError(error?.message || error?.statusText);
        this.loadingService.hideProcessBar();
        return EMPTY;
      }),
    );
  }

  delete$(id: string): Observable<SupplierDto> {
    return this.confirmationService
      .open$({
        text: 'Are you sure you want to remove this supplier?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => {
          return this.supplierApiService.delete$(id).pipe(
            map(dto => {
              if (this.snackBarService) {
                this.snackBarService.showMessage(
                  'supplier deleted successfully',
                );
              }
              this._suppliersSignal.update(suppliers =>
                suppliers.filter(supplier => supplier.id !== dto.id),
              );
              return dto;
            }),
            catchError((e: HttpErrorResponse) => {
              if (this.snackBarService) {
                this.snackBarService.showError(
                  `${e.error?.message ?? 'Error deleting supplier'} `,
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
