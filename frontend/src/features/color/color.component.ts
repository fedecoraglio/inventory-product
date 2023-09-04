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

import { LoadingService } from '@shared/services/loading.service';
import { ColorListComponent } from '@features/color/list/color-list.component';
import { ColorService } from '@features/color/services/color.service';
import { ColorAddComponent } from '@features/color/add/color-add.component';

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
    ColorListComponent,
    ColorAddComponent,
  ],
  providers: [ColorService, LoadingService],
  templateUrl: './color.component.html',
})
export class ColorComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly colorService = inject(ColorService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  private readonly showBrandList$ = new Subject<void>();
  readonly colorsSignal = this.colorService.colorsSignal;
  readonly countSignal = this.colorService.countSignal;
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  ngOnInit() {
    this.loadingService.showProcessBar();
    this.showBrandList$
      .pipe(
        switchMap(() => this.colorService.getAll$()),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.showBrandList$.next();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  executeNew() {
    this.matDialog
      .open(ColorAddComponent, {
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
            return this.colorService.save$(data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
        finalize(() => this.loadingService.hideProcessBar()),
      )
      .subscribe();
  }
}
