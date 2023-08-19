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

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { SupplierService } from '@features/supplier/services/supplier.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SupplierDto } from '@features/supplier/types/supplier.types';
import { SupplierFormComponent } from '@features/supplier/form/supplier-form.component';

@Component({
  selector: 'app-supplier-add',
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
    SupplierFormComponent,
  ],
  providers: [SupplierService],
  templateUrl: './supplier-add.component.html',
})
export class SupplierAddComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<SupplierDto> = inject(MatDialogRef);
  readonly supplierData: SupplierDto = inject(MAT_DIALOG_DATA);
  readonly save$ = new Subject<void>();
  @ViewChild('supplierForm') supplierForm: SupplierFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('90%', '85%');
    this.save$
      .pipe(
        filter(() => this.supplierForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.dialogRef.close(this.supplierForm.value ?? null));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
