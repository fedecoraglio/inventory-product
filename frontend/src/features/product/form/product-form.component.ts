import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, NgFor, NgIf, Location } from '@angular/common';
import {
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
import { Subject, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ConfirmationModule } from '../../../shared/confirmation/confirmation.module';
import { SnackBarModule } from '../../../shared/snack-bar/snack-bar.module';
import { RoutePaths } from '../../../app.routes-path';
import { ProductService } from '../services/product.service';
import { ProductFormFields } from '../types/product-form-fields.enum';
import { CategoryService } from '../../category/services/category.service';
import { FieldAutocompleteComponent } from '../../../shared/field-autocomplete/field-autocomplete.component';
import { FieldAutocompletePipe } from '../../../shared/field-autocomplete/field-item-autocomplete.pipe';
import { BrandService } from '../../brand/services/brand.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-product-form',
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
    NgIf,
    NgFor,
    ConfirmationModule,
    SnackBarModule,
    FieldAutocompleteComponent,
    FieldAutocompletePipe,
  ],
  providers: [ProductService, CategoryService, BrandService],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly loadingService = inject(LoadingService);

  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly pathEditFieldValue = computed(() => {
    const product = this.productService.productSignal();
    this.formGroup.patchValue({
      ...product,
    });
    this.categoryIds = product.categoryIds;
  });
  readonly productSignal = this.productService.productSignal;
  readonly categoriesSignal = this.categoryService.categoriesSignal;
  readonly brandsSignal = this.brandService.brandsSignal;
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;
  readonly location = inject(Location);
  readonly save$ = new Subject<void>();
  readonly formFields = ProductFormFields;
  readonly formGroup = new FormGroup({
    [ProductFormFields.Name]: new FormControl('', Validators.required),
    [ProductFormFields.Brand]: new FormControl(null, Validators.required),
    [ProductFormFields.Description]: new FormControl(''),
  });
  categoryIds = [];

  // Mapping from routing
  @Input() productId?: string;

  ngOnInit() {
    this.loadBrands();
    this.loadCategories();
    this.handlerExecuteSave();
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  categoriesAdded(categories: Map<string, string>) {
    this.categoryIds = Array.from(categories.keys());
  }

  get isFormValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  private loadCategories() {
    this.categoryService.getAll$().pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  private loadBrands() {
    this.brandService.getAll$().pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  private pathEditData() {
    if (this.productId) {
      this.productService
        .getById$(this.productId)
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
          const data = {
            ...this.formGroup.getRawValue(),
            categoryIds: this.categoryIds,
          };
          if (this.productId) {
            return this.productService.update$(this.productId, data);
          } else {
            return this.productService.save$(data);
          }
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Products}`]);
      });
  }
}
