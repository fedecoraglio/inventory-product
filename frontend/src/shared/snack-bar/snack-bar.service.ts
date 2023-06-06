import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent, SnackBarOptions } from './snack-bar.component';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private readonly snackBar: MatSnackBar) {}

  showError(message: string, title?: string, options?: MatSnackBarConfig<any>) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'snack-bar',
      data: {
        type: 'error',
        message,
        title,
      } as SnackBarOptions,
      ...options,
    });
  }

  showMessage(
    message: string,
    title?: string,
    options?: MatSnackBarConfig & {
      hasIcon?: boolean;
    },
  ) {
    const { hasIcon } = options || {};

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'snack-bar',
      data: {
        type: 'success',
        message,
        title,
        hasIcon: typeof hasIcon === 'boolean' ? hasIcon : true,
      } as SnackBarOptions,
      ...options,
    });
  }
}
