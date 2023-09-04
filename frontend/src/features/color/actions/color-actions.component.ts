import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  EMPTY,
  Observable,
  Subject,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { LoadingService } from '@shared/services/loading.service';
import { ColorService } from '@features/color/services/color.service';
import { ColorDto } from '@features/color/types/color.types';
import { ColorEditComponent } from '@features/color/edit/color-edit.component';

interface Action {
  name: string;
  icon?: string;
  disabled?: boolean;
  handler?: () => void;
}

@Component({
  selector: 'app-color-actions',
  standalone: true,
  templateUrl: './color-actions.component.html',
  styleUrls: ['./color-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SnackBarModule,
    ConfirmationModule,
    AsyncPipe,
  ],
})
export class ColorActionsComponent implements OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly colorService = inject(ColorService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  @Input() color: ColorDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: () => this.editBrand(),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: () => this.deleteBrand(),
    },
  ]);

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  editBrand() {
    if (!this.color) {
      return;
    }
    this.matDialog
      .open(ColorEditComponent, {
        disableClose: true,
        width: '600px',
        data: this.color,
      })
      .afterClosed()
      .pipe(
        switchMap(data => {
          if (data) {
            return this.colorService.update$(data.id, data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  deleteBrand() {
    this.colorService
      .delete$(this.color.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
}
