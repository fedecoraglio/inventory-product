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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { ColorFormComponent } from '@features/color/form/color-form.component';
import { ColorService } from '@features/color/services/color.service';
import { ColorDto } from '@features/color/types/color.types';

@Component({
  selector: 'app-color-add',
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
    ColorFormComponent,
  ],
  providers: [ColorService],
  templateUrl: './color-add.component.html',
})
export class ColorAddComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly dialogRef: MatDialogRef<ColorDto> = inject(MatDialogRef);
  readonly colorData: ColorDto = inject(MAT_DIALOG_DATA);
  readonly save$ = new Subject<void>();
  @ViewChild('colorForm') colorForm: ColorFormComponent;

  ngOnInit() {
    this.dialogRef.updateSize('90%', '85%');
    this.save$
      .pipe(
        filter(() => this.colorForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.dialogRef.close(this.colorForm.value ?? null));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
