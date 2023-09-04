import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, filter, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

import { SnackBarModule } from '@shared/snack-bar/snack-bar.module';
import { MatCardModule } from '@angular/material/card';
import { PurchaseFormComponent } from '@features/purchase/form/purchase-form.component';

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    NgIf,
    NgFor,
    SnackBarModule,
    PurchaseFormComponent
  ],
  templateUrl: './purchase-create.component.html',
})
export class PurchaseCreateComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly save$ = new Subject<void>();
  @ViewChild('purchaseForm') purchaseForm: PurchaseFormComponent;

  ngOnInit() {
    this.save$
      .pipe(
        filter(() => this.purchaseForm.isValid),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
