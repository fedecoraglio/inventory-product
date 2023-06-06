import { NgModule } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from './confirmation.service';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [ConfirmationDialogComponent],
  providers: [ConfirmationService],
})
export class ConfirmationModule {}
