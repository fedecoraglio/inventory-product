import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../../app.routes-path';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';

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
    NgFor
  ],
})
export class SidenavComponent {
  roles: any[];
  roleSelectedId: number;
  navList: any[] = [
    {
      order: 1,
      link: RoutePaths.Home,
      icon: 'supervised_user_circle',
      text: 'Home',
    },
    {
      order: 2,
      link: RoutePaths.Categories,
      icon: 'account_circle',
      text: 'Categories',
    },
  ];
  constructor() {}

  logout() {}
}
