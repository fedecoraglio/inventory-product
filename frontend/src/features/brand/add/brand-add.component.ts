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
import { BrandService } from '@features/brand/services/brand.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BrandDto } from '../types/brand.types';
import { BrandFormComponent } from '../form/brand-form.component';

@Component({
  selector: 'app-brand-add',
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
    BrandFormComponent,
  ],
  providers: [BrandService],
  templateUrl: './brand-add.component.html',
})
export class BrandAddComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<BrandDto> = inject(MatDialogRef);
  readonly brandData: BrandDto = inject(MAT_DIALOG_DATA);
  readonly save$ = new Subject<void>();
  @ViewChild('brandForm') brandForm: BrandFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('800px', '400px');
    this.save$
      .pipe(
        filter(() => this.brandForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.dialogRef.close(this.brandForm.value ?? null));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
