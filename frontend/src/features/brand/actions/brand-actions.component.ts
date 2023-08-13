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
import { BrandService } from '@features/brand/services/brand.service';
import { BrandDto } from '@features/brand/types/brand.types';
import { BrandEditComponent } from '@features/brand/edit/brand-edit.component';
import { LoadingService } from '@shared/services/loading.service';

interface Action {
  name: string;
  icon?: string;
  disabled?: boolean;
  handler?: () => void;
}

@Component({
  selector: 'app-brand-actions',
  standalone: true,
  templateUrl: './brand-actions.component.html',
  styleUrls: ['./brand-actions.component.scss'],
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
export class BrandActionsComponent implements OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly brandService = inject(BrandService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  @Input() brand: BrandDto;

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
    if (!this.brand) {
      return;
    }
    this.matDialog
      .open(BrandEditComponent, {
        disableClose: true,
        width: '600px',
        data: this.brand,
      })
      .afterClosed()
      .pipe(
        switchMap(data => {
          if (data) {
            return this.brandService.update$(data.id, data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  deleteBrand() {
    this.brandService
      .delete$(this.brand.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
}
