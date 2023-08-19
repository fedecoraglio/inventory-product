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

import { SupplierDto } from '@features/supplier/types/supplier.types';
import { SupplierFormComponent } from '@features/supplier/form/supplier-form.component';

@Component({
  selector: 'app-supplier-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    NgFor,
    SnackBarModule,
    SupplierFormComponent,
  ],
  templateUrl: './supplier-edit.component.html',
})
export class SupplierEditComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<SupplierDto> = inject(MatDialogRef);
  readonly supplierData: SupplierDto = inject(MAT_DIALOG_DATA);
  readonly execute$ = new Subject<void>();
  @ViewChild('supplierForm') supplierForm: SupplierFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('90%', '85%');
    this.execute$
      .pipe(
        filter(() => this.supplierForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() =>
        this.dialogRef.close({
          ...this.supplierForm.value,
          id: this.supplierData.id,
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
