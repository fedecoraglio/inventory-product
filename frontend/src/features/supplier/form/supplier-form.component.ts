import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  ReplaySubject,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { SupplierFormFields } from '@features/supplier/types/supplier-form-fields.enum';
import { SupplierDto } from '@features/supplier/types/supplier.types';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatAutocompleteModule,
    NgIf,
    NgFor,
    ConfirmationModule,
    SnackBarModule,
  ],
  providers: [],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
})
export class SupplierFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy$ = new Subject<void>();
  readonly save$ = new Subject<void>();
  readonly supplierFormFields = SupplierFormFields;
  readonly formGroup = new FormGroup({
    [SupplierFormFields.Name]: new FormControl('', Validators.required),
    [SupplierFormFields.Email]: new FormControl('', [Validators.required, Validators.email]),
    [SupplierFormFields.Description]: new FormControl(''),
  });
  readonly supplierData$ = new ReplaySubject<SupplierDto>(1);
  @Input() set supplierData(supplierData: SupplierDto) {
    this.supplierData$.next(supplierData);
  }

  get supplierFormEmailField() {
    return this.formGroup.get(SupplierFormFields.Email);
  }

  ngOnInit() {
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.supplierData$.pipe(takeUntil(this.onDestroy$)).subscribe(supplierDto => {
      this.formGroup.patchValue(supplierDto);
      this.formGroup.updateValueAndValidity();
    });
  }

  get isValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  get value(): SupplierDto {
    return this.formGroup.getRawValue() as SupplierDto;
  }

  private pathEditData() {
    if (this.supplierData) {
      this.formGroup.patchValue({
        ...this.supplierData,
      });
    }
  }
}
