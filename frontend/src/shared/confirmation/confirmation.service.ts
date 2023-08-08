import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogOptions,
} from './confirmation-dialog.component';

@Injectable()
export class ConfirmationService {
  constructor(private readonly matDialog: MatDialog) {}

  open$(options: ConfirmationDialogOptions): Observable<boolean> {
    return this.matDialog
      .open(ConfirmationDialogComponent, {
        data: options,
      })
      .afterClosed()

  }
}
