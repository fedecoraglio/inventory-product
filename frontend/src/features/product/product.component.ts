import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { RoutePaths } from '../../app.routes-path';
import { ProductService } from './services/product.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ProductListComponent } from './list/product-list.component';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    PaginationComponent,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    NgIf,
  ],
  providers: [ProductService],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly listProducts$ = new Subject<boolean>();
  readonly productsSignal = this.productService.productsSignal;
  // TODO: pagination is pending.
  readonly countSignal = this.productService.countSignal;
  readonly isLoadingSignal = this.productService.isLoadingSignal;

  ngOnInit() {
    this.listProducts$
      .pipe(
        switchMap(showMore => this.productService.getAll$(showMore)),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
    this.showMoreItem(false);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToNewProduct() {
    this.route.navigate([`/${RoutePaths.Products}/new`]);
  }

  showMoreItem(showMore: boolean) {
    this.listProducts$.next(showMore);
  }
}
