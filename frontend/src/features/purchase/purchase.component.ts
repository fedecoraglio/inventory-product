import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { RoutePaths } from '../../app.routes-path';


@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule, MatButtonModule, NgIf],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit, OnDestroy {
  private readonly route = inject(Router);
  private readonly onDestroy$ = new Subject<void>();

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToNew() {
    this.route.navigate([`/${RoutePaths.Purchases}/new`]);
  }
}
