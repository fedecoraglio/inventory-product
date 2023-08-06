import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject, of, switchMap } from 'rxjs';

import { CategoryDto } from '../types/category.types';
import { CategoryService } from '../services/category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackBarModule } from '../../../shared/snack-bar/snack-bar.module';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../app.routes-path';
import { ConfirmationModule } from '../../../shared/confirmation/confirmation.module';

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
export class CategoryActionsComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(Router);
  private readonly deleteCategoryAction$ = new Subject<boolean>();
  private readonly changeCategoryAction$ = new Subject<boolean>();
  readonly isLoadingSignal = this.categoryService.isLoadingSignal;

  @Input() category: CategoryDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: this.changeCategory.bind(this),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: this.deleteCategory.bind(this),
    },
  ]);

  constructor() {
    this.deleteCategoryAction$
      .pipe(
        switchMap(() => this.categoryService.delete$(this.category.id)),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Categories}`]);
      });

    this.changeCategoryAction$
      .pipe(
        switchMap(() =>
          this.categoryService.getById$(this.category.id),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.route.navigate([
          `/${RoutePaths.Categories}/${this.category.id}`,
        ]);
      });
  }

  changeCategory() {
    if (!this.category) {
      return;
    }
    this.changeCategoryAction$.next(true);
  }

  deleteCategory() {
    this.deleteCategoryAction$.next(true);
  }
}
