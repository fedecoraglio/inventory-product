import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  EMPTY,
  Subject,
  delay,
  filter,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { BrandListComponent } from '@features/brand/list/brand-list.component';
import { BrandService } from '@features/brand/services/brand.service';
import { BrandAddComponent } from './add/brand-add.component';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgIf,
    BrandListComponent,
    BrandAddComponent,
  ],
  providers: [BrandService, LoadingService],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly brandService = inject(BrandService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  private readonly showBrandList$ = new Subject<void>();
  readonly brandsSignal = this.brandService.brandsSignal;
  readonly countSignal = this.brandService.countSignal;
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  ngOnInit() {
    this.showBrandList$
      .pipe(
        switchMap(() => this.brandService.getAll$()),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.showBrandList$.next();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  executeNewBrand() {
    this.matDialog
      .open(BrandAddComponent, {
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
            return this.brandService.save$(data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
        finalize(() => this.loadingService.hideProcessBar()),
      )
      .subscribe();
  }
}
