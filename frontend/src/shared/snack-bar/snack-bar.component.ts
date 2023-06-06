import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export type SnackBarOptions = Readonly<{
  type: 'error' | 'success';
  title?: string;
  message: string;
  hasIcon?: boolean;
}>;

@Component({
  selector: 'snack-bar-component',
  templateUrl: './snack-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarOptions) {}
}
