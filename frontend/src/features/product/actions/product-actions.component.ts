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
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackBarModule } from '../../../shared/snack-bar/snack-bar.module';
import { RoutePaths } from '../../../app.routes-path';
import { ConfirmationModule } from '../../../shared/confirmation/confirmation.module';
import { ProductService } from '../services/product.service';
import { ProductDto } from '../types/product.types';

interface Action {
  name: string;
  icon?: string;
  disabled?: boolean;
  handler?: () => void;
}

@Component({
  selector: 'app-product-actions',
  standalone: true,
  templateUrl: './product-actions.component.html',
  styleUrls: ['./product-actions.component.scss'],
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
export class ProductActionsComponent {
  private readonly productService = inject(ProductService);
  private readonly route = inject(Router);
  private readonly deleteAction$ = new Subject<boolean>();
  private readonly changeAction$ = new Subject<boolean>();
  readonly isLoadingSignal = this.productService.isLoadingSignal;

  @Input() product: ProductDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: this.changeItem.bind(this),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: this.deleteItem.bind(this),
    },
  ]);

  constructor() {
    this.deleteAction$
      .pipe(
        switchMap(() => this.productService.delete$(this.product.id)),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Products}`]);
      });

    this.changeAction$
      .pipe(
        switchMap(() => this.productService.getById$(this.product.id)),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Products}/${this.product.id}`]);
      });
  }

  changeItem() {
    if (!this.product) {
      return;
    }
    this.changeAction$.next(true);
  }

  deleteItem() {
    this.deleteAction$.next(true);
  }
}
