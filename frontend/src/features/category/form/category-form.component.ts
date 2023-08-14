import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  NgFor,
  NgIf,
  Location,
} from '@angular/common';
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

import { CategoryFormFields } from '../types/category-form-fields.enum';
import { CategoryService } from '../services/category.service';
import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { CategoryDto } from '../types/category.types';

@Component({
  selector: 'app-category-form',
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
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy$ = new Subject<void>();
  readonly save$ = new Subject<void>();
  readonly categoryFormFields = CategoryFormFields;
  readonly formGroup = new FormGroup({
    [CategoryFormFields.Name]: new FormControl('', Validators.required),
    [CategoryFormFields.Description]: new FormControl(''),
  });
  readonly categoryData$ = new ReplaySubject<CategoryDto>(1);
  @Input() set categoryData(categoryData: CategoryDto) {
    this.categoryData$.next(categoryData);
  }

  ngOnInit() {
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.categoryData$.pipe(takeUntil(this.onDestroy$)).subscribe(dto => {
      this.formGroup.patchValue(dto);
      this.formGroup.updateValueAndValidity();
    });
  }

  get isValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  get value(): CategoryDto {
    return this.formGroup.getRawValue();
  }

  private pathEditData() {
    if (this.categoryData) {
      this.categoryData$.pipe(
        tap(data =>
          this.formGroup.patchValue({
            ...data,
          }),
        ),
        takeUntil(this.onDestroy$),
      );
    }
  }
}
