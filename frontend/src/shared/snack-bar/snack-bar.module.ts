import { NgModule } from '@angular/core';
import { SnackBarService } from './snack-bar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from './snack-bar.component';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  providers: [SnackBarService],
  declarations: [SnackBarComponent],
})
export class SnackBarModule {}
