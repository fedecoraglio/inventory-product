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
import {
  Observable,
  Subject,
  concatMap,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { RoutePaths } from '../../../app.routes-path';
import { ConfirmationModule } from '@shared/confirmation/confirmation.module';
import { BrandService } from '@features/brand/services/brand.service';
import { BrandDto } from '@features/brand/types/brand.types';

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
export class BrandActionsComponent implements OnInit, OnDestroy {
  private readonly brandService = inject(BrandService);
  private readonly route = inject(Router);
  private readonly deleteAction$ = new Subject<string>();
  private readonly changeAction$ = new Subject<boolean>();
  private readonly onDestroy$ = new Subject<void>();
  readonly isLoadingSignal = this.brandService.isLoadingSignal;

  @Input() brand: BrandDto;

  readonly action$: Observable<Action[]> = of([
    {
      name: 'edit',
      icon: 'edit',
      handler: this.change.bind(this),
    },
    {
      name: 'delete',
      icon: 'delete',
      handler: () => this.deleteBrand(),
    },
  ]);

  ngOnInit() {
    this.changeAction$
      .pipe(
        switchMap(() => this.brandService.getById$(this.brand.id)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.route.navigate([`/${RoutePaths.Brands}/${this.brand.id}`]);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  change() {
    if (!this.brand) {
      return;
    }
    this.changeAction$.next(true);
  }

  deleteBrand() {
    console.log('llama!!');
    this.brandService
      .delete$(this.brand.id)
      .pipe(
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        console.log('brands!!');
        //this.route.navigate([`/${RoutePaths.Brands}`]);
      });
  }
}
