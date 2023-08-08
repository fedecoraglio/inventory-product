import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { RoutePaths } from '../../app.routes-path';
import { BrandListComponent } from '@features/brand/list/brand-list.component';
import { BrandService } from '@features/brand/services/brand.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    BrandListComponent,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    NgIf,
  ],
  providers: [BrandService],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, OnDestroy {
  private readonly brandService = inject(BrandService);
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly showBrandList$ = new Subject<boolean>();
  readonly brandsSignal = this.brandService.brandsSignal;
  // TODO: pagination is pending.
  readonly countSignal = this.brandService.countSignal;
  readonly isLoadingSignal = this.brandService.isLoadingSignal;

  ngOnInit() {
    this.showBrandList$
      .pipe(
        switchMap(() => this.brandService.getAll$()),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.show(false);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  gotToNew() {
    this.route.navigate([`/${RoutePaths.Brands}/new`]);
  }

  show(showMore: boolean) {
    this.showBrandList$.next(showMore);
  }
}
