import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductActionsComponent } from '../actions/product-actions.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductDto } from '../types/product.types';


@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatPaginatorModule,
    DatePipe,
    ProductActionsComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<ProductDto>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() set products(products: ProductDto[]) {
    this.dataSource = new MatTableDataSource(products);
  }

  readonly displayedColumns: string[] = [
    'name',
    'brand',
    'description',
    'createdAt',
    'actions',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
