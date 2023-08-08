import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import {
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


import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { BrandService } from '@features/brand/services/brand.service';
import { BrandFormFields } from '@features/brand/types/brand-form-fields.enum';
import { RoutePaths } from '../../../app.routes-path';

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
  providers: [BrandService],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent implements OnInit, OnDestroy {
  private readonly brandService = inject(BrandService);
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();
  private readonly pathEditFieldValue = computed(() => {
    const brand = this.brandService.brandSignal();
    this.formGroup.patchValue({
      ...brand,
    });
  });
  readonly location = inject(Location);
  readonly save$ = new Subject<void>();
  readonly brandFormFields = BrandFormFields;
  readonly formGroup = new FormGroup({
    [BrandFormFields.Name]: new FormControl('', Validators.required),
    [BrandFormFields.Description]: new FormControl(''),
  });
  readonly isLoadingSignal = this.brandService.isLoadingSignal;

  // Mapping from routing
  @Input() brandId?: string;

  ngOnInit() {
    this.handlerExecuteSave();
    this.pathEditData();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get isFormValid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup?.valid;
  }

  private pathEditData() {
    if (this.brandId) {
      this.brandService
        .getById$(this.brandId)
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
          const data = this.formGroup.getRawValue();
          if (this.brandId) {
            return this.brandService.update$(this.brandId, data);
          } else {
            return this.brandService.save$(data);
          }
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Brands}`]);
      });
  }
}
