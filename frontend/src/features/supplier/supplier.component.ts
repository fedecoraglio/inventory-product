import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  EMPTY,
  Subject,
  delay,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { SupplierListComponent } from '@features/supplier/list/supplier-list.component';
import { SupplierService } from '@features/supplier/services/supplier.service';
import { SupplierAddComponent } from '@features/supplier/add/supplier-add.component';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgIf,
    SupplierListComponent,
    SupplierAddComponent,
  ],
  providers: [SupplierService, LoadingService],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly supplierService = inject(SupplierService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  private readonly showSupplierList$ = new Subject<void>();
  readonly suppliersSignal = this.supplierService.suppliersSignal;
  readonly countSignal = this.supplierService.countSignal;
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  ngOnInit() {
    this.loadingService.showProcessBar();
    this.showSupplierList$
      .pipe(
        switchMap(() => this.supplierService.getAll$()),
        takeUntil(this.onDestroy$),
        //finalize(() => this.loadingService.hideProcessBar()),
      )
      .subscribe();
    this.showSupplierList$.next();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  executeNewItem() {
    this.matDialog
      .open(SupplierAddComponent, {
        disableClose: true,
        width: '1200px',
        data: null,
      })
      .afterClosed()
      .pipe(
        tap(() => this.loadingService.showProcessBar()),
        delay(0),
        switchMap(data => {
          if (data) {
            return this.supplierService.save$(data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
        finalize(() => this.loadingService.hideProcessBar()),
      )
      .subscribe();
  }
}
