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
  takeUntil
} from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { ColorFormFields } from '@features/color/types/color-form-fields.enum';
import { ColorDto } from '@features/color/types/color.types';

@Component({
  selector: 'app-color-form',
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
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
})
export class ColorFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy$ = new Subject<void>();
  readonly save$ = new Subject<void>();
  readonly colorFormFields = ColorFormFields;
  readonly formGroup = new FormGroup({
    [ColorFormFields.Name]: new FormControl('', Validators.required),
    [ColorFormFields.Description]: new FormControl(''),
  });
  readonly colorData$ = new ReplaySubject<ColorDto>(1);
  @Input() set colorData(data: ColorDto) {
    this.colorData$.next(data);
  }

  ngOnInit() {
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.colorData$.pipe(takeUntil(this.onDestroy$)).subscribe(brandDto => {
      this.formGroup.patchValue(brandDto);
      this.formGroup.updateValueAndValidity();
    });
  }

  get isValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  get value(): ColorDto {
    return this.formGroup.getRawValue() as ColorDto;
  }

  private pathEditData() {
    if (this.colorData) {
      this.formGroup.patchValue({
        ...this.colorData,
      });
    }
  }
}
