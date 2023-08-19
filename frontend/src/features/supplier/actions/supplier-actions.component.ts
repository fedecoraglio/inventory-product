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
import { SupplierDto } from '@features/supplier/types/supplier.types';
import { SupplierService } from '@features/supplier/services/supplier.service';
import { SupplierEditComponent } from '@features/supplier/edit/supplier-edit.component';

interface Action {
  name: string;
  icon?: string;
  disabled?: boolean;
  handler?: () => void;
}

@Component({
  selector: 'app-supplier-actions',
  standalone: true,
  templateUrl: './supplier-actions.component.html',
  styleUrls: ['./supplier-actions.component.scss'],
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
export class SupplierActionsComponent implements OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly supplierService = inject(SupplierService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  @Input() supplier: SupplierDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: () => this.editSupplier(),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: () => this.deleteSupplier(),
    },
  ]);

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  editSupplier() {
    if (!this.supplier) {
      return;
    }
    this.matDialog
      .open(SupplierEditComponent, {
        disableClose: true,
        width: '600px',
        data: this.supplier,
      })
      .afterClosed()
      .pipe(
        switchMap(data => {
          if (data) {
            return this.supplierService.update$(data.id, data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  deleteSupplier() {
    this.supplierService
      .delete$(this.supplier.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
}
