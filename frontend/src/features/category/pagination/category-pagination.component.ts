import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './category-pagination.component.html',
  styleUrls: ['./category-pagination.component.scss'],
})
export class CategoryPaginationComponent {
  @Input() btnName: string = 'Show more';

  @Output() showMoreClick = new EventEmitter<boolean>();

  onClickShowMore() {
    this.showMoreClick.emit(true);
  }
}
