import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { CategoryDto } from '@features/category/types/category.types';
import { CategoryFormComponent } from '@features/category/form/category-form.component';
import { CategoryService } from '@features/category/services/category.service';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    NgFor,
    SnackBarModule,
    CategoryFormComponent
  ],
  providers: [CategoryService],
  templateUrl: './category-add.component.html',
})
export class CategoryAddComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<CategoryDto> = inject(MatDialogRef);
  readonly brandData: CategoryDto = inject(MAT_DIALOG_DATA);
  readonly save$ = new Subject<void>();
  @ViewChild('categoryForm') categoryForm: CategoryFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('800px', '400px');
    this.save$
      .pipe(
        filter(() => this.categoryForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.dialogRef.close(this.categoryForm.value ?? null));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
