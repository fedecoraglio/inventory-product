import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, Location, AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { PurchaseFormGeneralFields } from '@features/purchase/types/purchase-form-fields.enum';
import { SupplierService } from '@features/supplier/services/supplier.service';
import { SupplierDto } from '@features/supplier/types/supplier.types';

@Component({
  selector: 'app-purchase-general-form',
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
    AsyncPipe
  ],
  providers: [SupplierService],
  templateUrl: './purchase-form-general.component.html',
})
export class PurchaseGeneralFormComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly location = inject(Location);
  readonly save$ = new Subject<void>();
  readonly formFields = PurchaseFormGeneralFields;
  readonly formGroup = new FormGroup({
    [PurchaseFormGeneralFields.Supplier]: new FormControl('', Validators.required),
    [PurchaseFormGeneralFields.PurchaseDate]: new FormControl(null, Validators.required),
  });

  readonly suppliers$ = new ReplaySubject<SupplierDto[]>(1);
  @Input() set suppliers(suppliers: SupplierDto[]) {
    this.suppliers$.next(suppliers);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get isFormValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }
}
