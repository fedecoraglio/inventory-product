import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductActionsComponent } from '../actions/product-actions.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductDto } from '../types/product.types';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ProductService } from '../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    ProductActionsComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly onDestroy$ = new Subject<void>();
  private searchValue: string | null;
  private readonly productsSignal = this.productService.productsSignal;
  private readonly products$ = toObservable(this.productsSignal);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<ProductDto>([]);
  readonly countSignal = this.productService.countSignal;
  readonly isLoadingSignal = this.productService.isLoadingSignal;
  readonly pageSizeOptions = [ProductService.DEFAULT_PRODUCT_LIMIT, 60, 200];
  readonly searchInputControl: FormControl = new FormControl();
  readonly displayedColumns: string[] = [
    'name',
    'brand',
    'description',
    'createdAt',
    'actions',
  ];

  ngOnInit() {
    this.configSearch();
    this.initLoadProduct();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          return this.productService.getAll$({
            page: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
            query: this.searchValue,
          });
        }),
      )
      .subscribe();
  }

  private initLoadProduct() {
    this.products$.pipe(takeUntil(this.onDestroy$)).subscribe(products => {
      this.dataSource = new MatTableDataSource<ProductDto>(products);
    });
    this.productService
      .getAll$({ page: 1, pageSize: ProductService.DEFAULT_PRODUCT_LIMIT })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  private configSearch() {
    this.searchInputControl.valueChanges
      .pipe(
        filter<string>(query => query.length > 0 || query.length === 0),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(() => (this.paginator.pageIndex = 0)),
        switchMap(query => {
          this.searchValue = query;
          return this.productService.getAll$({
            page: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
            query,
          });
        }),
      )
      .subscribe();
  }
}
