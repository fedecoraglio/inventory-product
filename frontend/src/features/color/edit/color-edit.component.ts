import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { ColorFormComponent } from '@features/color/form/color-form.component';
import { ColorDto } from '@features/color/types/color.types';


@Component({
  selector: 'app-color-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    NgFor,
    SnackBarModule,
    ColorFormComponent,
  ],
  templateUrl: './color-edit.component.html',
})
export class ColorEditComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<ColorDto> = inject(MatDialogRef);
  readonly colorData: ColorDto = inject(MAT_DIALOG_DATA);
  readonly execute$ = new Subject<void>();
  @ViewChild('colorForm') colorForm: ColorFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('90%', '85%');
    this.execute$
      .pipe(
        filter(() => this.colorForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() =>
        this.dialogRef.close({
          ...this.colorForm.value,
          id: this.colorData.id,
        }),
      );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
