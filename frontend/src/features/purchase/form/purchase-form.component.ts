import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, Location } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import {
  PurchaseFormFields,
  PurchaseFormGeneralFields,
} from '@features/purchase/types/purchase-form-fields.enum';
import { SupplierService } from '@features/supplier/services/supplier.service';
import { PurchaseGeneralFormComponent } from '@features/purchase/form/general/purchase-form-general.component';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    NgIf,
    NgFor,
    ConfirmationModule,
    SnackBarModule,
    PurchaseGeneralFormComponent,
  ],
  providers: [SupplierService],
  templateUrl: './purchase-form.component.html',
})
export class PurchaseFormComponent implements OnInit, OnDestroy {
  private readonly supplierService = inject(SupplierService);
  private readonly onDestroy$ = new Subject<void>();
  readonly suppliersSignal = this.supplierService.suppliersSignal;
  readonly location = inject(Location);
  readonly save$ = new Subject<void>();
  readonly formFields = PurchaseFormGeneralFields;
  readonly formGroup = new FormGroup({});

  get isValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  get generalField(): AbstractControl {
    return this.formGroup.get(PurchaseFormFields.General);
  }

  ngOnInit() {
    this.loadSuppliers();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get isFormValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  private loadSuppliers() {
    this.supplierService.getAll$().pipe(takeUntil(this.onDestroy$)).subscribe();
  }
}
