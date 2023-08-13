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
import { BrandFormFields } from '@features/brand/types/brand-form-fields.enum';
import { BrandDto } from '../types/brand.types';

@Component({
  selector: 'app-brand-form',
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
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy$ = new Subject<void>();
  readonly save$ = new Subject<void>();
  readonly brandFormFields = BrandFormFields;
  readonly formGroup = new FormGroup({
    [BrandFormFields.Name]: new FormControl('', Validators.required),
    [BrandFormFields.Description]: new FormControl(''),
  });
  readonly brandData$ = new ReplaySubject<BrandDto>(1);
  @Input() set brandData(brandData: BrandDto) {
    this.brandData$.next(brandData);
  }

  ngOnInit() {
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.brandData$.pipe(takeUntil(this.onDestroy$)).subscribe(brandDto => {
      this.formGroup.patchValue(brandDto);
      this.formGroup.updateValueAndValidity();
    });
  }

  get isValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  get value(): BrandDto {
    return this.formGroup.getRawValue() as BrandDto;
  }

  private pathEditData() {
    if (this.brandData) {
      this.formGroup.patchValue({
        ...this.brandData,
      });
    }
  }
}
