import { Component, Output, EventEmitter, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '@shared/services/loading.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  providers: [LoadingService],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTreeModule,
    MatProgressBarModule,
    NgIf,
  ],
})
export class HeaderComponent {
  private readonly loadingService = inject(LoadingService);
  readonly isLoadingSignal = this.loadingService.isLoadingSignal;

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  logout = () => {};

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
}
