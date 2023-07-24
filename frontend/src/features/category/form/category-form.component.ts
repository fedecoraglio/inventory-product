import {
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
import { Subject, filter, switchMap, takeUntil, tap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { CategoryFormFields } from '../types/category-form-fields.enum';
import { CategoryService } from '../services/category.service';
import { ConfirmationModule } from '../../../shared/confirmation/confirmation.module';
import { SnackBarModule } from '../../../shared/snack-bar/snack-bar.module';
import { RoutePaths } from '../../../app.routes-path';

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
  providers: [CategoryService],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly pathEditFieldValue = computed(() => {
    const category = this.categoryService.categorySignal();
    this.categoryFormGroup.patchValue({
      ...category,
    });
  });
  readonly location = inject(Location);
  readonly save$ = new Subject<void>();
  readonly categoryFormFields = CategoryFormFields;
  readonly categoryFormGroup = new FormGroup({
    [CategoryFormFields.Name]: new FormControl('', Validators.required),
    [CategoryFormFields.Content]: new FormControl(''),
    [CategoryFormFields.Summary]: new FormControl(''),
  });
  readonly isLoadingSignal = this.categoryService.isLoadingSignal;

  // Mapping from routing
  @Input() categoryId?: string;

  ngOnInit() {
    this.handlerExecuteSave();
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get isFormValid(): boolean {
    this.categoryFormGroup.markAllAsTouched();

    return this.categoryFormGroup?.valid;
  }

  private pathEditData() {
    if (this.categoryId) {
      this.categoryService
        .getById$(this.categoryId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.pathEditFieldValue();
        });
    }
  }

  private handlerExecuteSave() {
    this.save$
      .pipe(
        filter(() => this.isFormValid),
        switchMap(() => {
          const data = this.categoryFormGroup.getRawValue();
          if (this.categoryId) {
            return this.categoryService.update$(this.categoryId, data);
          } else {
            return this.categoryService.save$(data);
          }
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Categories}`]);
      });
  }
}
