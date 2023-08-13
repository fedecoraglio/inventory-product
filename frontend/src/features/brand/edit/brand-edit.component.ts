import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { BrandDto } from '../types/brand.types';
import { BrandFormComponent } from '../form/brand-form.component';

@Component({
  selector: 'app-brand-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    NgFor,
    SnackBarModule,
    BrandFormComponent,
  ],
  templateUrl: './brand-edit.component.html',
})
export class BrandEditComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<BrandDto> = inject(MatDialogRef);
  readonly brandData: BrandDto = inject(MAT_DIALOG_DATA);
  readonly execute$ = new Subject<void>();
  @ViewChild('brandForm') brandForm: BrandFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('800px', '400px');
    this.execute$
      .pipe(
        filter(() => this.brandForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() =>
        this.dialogRef.close({
          ...this.brandForm.value,
          id: this.brandData.id,
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
