import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { CategoryFormComponent } from '@features/category/form/category-form.component';
import { CategoryDto } from '@features/category/types/category.types';


@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    NgFor,
    SnackBarModule,
    CategoryFormComponent,
  ],
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<CategoryDto> = inject(MatDialogRef);
  readonly categoryData: CategoryDto = inject(MAT_DIALOG_DATA);
  readonly execute$ = new Subject<void>();
  @ViewChild('categoryForm') categoryForm: CategoryFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('800px', '400px');
    this.execute$
      .pipe(
        filter(() => this.categoryForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() =>
        this.dialogRef.close({
          ...this.categoryForm.value,
          id: this.categoryData.id,
        }),
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
