import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../../app.routes-path';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatTreeModule,
    MatDividerModule,
    MatListModule,
    NgFor,
  ],
})
export class SidenavComponent {
  private readonly navigationService = inject(NavigationService);
  readonly navigationItemsSignal = this.navigationService.navigationItemsSignal;

  logout() {}
}
