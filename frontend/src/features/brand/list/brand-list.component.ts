import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BrandActionsComponent } from '@features/brand/actions/brand-actions.component';
import { BrandDto } from '@features/brand/types/brand.types';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    BrandActionsComponent,
  ],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandListComponent {
  dataSource = new MatTableDataSource<BrandDto>();
  @Input() set brands(brands: BrandDto[]) {
    this.dataSource = new MatTableDataSource(brands);
  }

  readonly displayedColumns: string[] = [
    'name',
    'description',
    'createdAt',
    'actions',
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
