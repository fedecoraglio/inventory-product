import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  standalone: true,
  selector: 'app-home-product-card',
  templateUrl: 'home-product-card.component.html',
  styleUrls: ['home-product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
})
export class HomeProductCardComponent {
  @Input() productTitle: string;
  @Input() productIcon: string;
}
