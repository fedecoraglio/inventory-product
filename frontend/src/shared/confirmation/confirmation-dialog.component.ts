import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export type ConfirmationDialogOptions = Readonly<{
  title?: string;
  text: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmColor?: string;
}>;

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  host: { class: 'block p-4' },
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public options: ConfirmationDialogOptions,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) {}

  ngOnInit() {
    this.dialogRef.updateSize('450px');
  }

  handleResponse(val: boolean) {
    this.dialogRef.close(val);
  }
}
