import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, Subject, of, switchMap, takeUntil } from 'rxjs';

import { CategoryDto } from '../types/category.types';
import { CategoryService } from '../services/category.service';
import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { LoadingService } from '@shared/services/loading.service';
import { CategoryEditComponent } from '../edit/category-edit.component';

interface Action {
  name: string;
  icon?: string;
  disabled?: boolean;
  handler?: () => void;
}

@Component({
  selector: 'app-category-actions',
  standalone: true,
  templateUrl: './category-actions.component.html',
  styleUrls: ['./category-actions.component.scss'],
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
export class CategoryActionsComponent implements OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  private readonly onDestroy$ = new Subject<void>();
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  @Input() category: CategoryDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: () => this.editCategory(),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: () => this.deleteCategory(),
    },
  ]);

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  editCategory() {
    if (!this.category) {
      return;
    }
    this.matDialog
      .open(CategoryEditComponent, {
        disableClose: true,
        width: '600px',
        data: this.category,
      })
      .afterClosed()
      .pipe(
        switchMap(data => {
          if (data) {
            return this.categoryService.update$(data.id, data);
          }
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  deleteCategory() {
    this.categoryService
      .delete$(this.category.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
}
