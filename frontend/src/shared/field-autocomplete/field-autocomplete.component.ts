import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { FieldItemAutocomplete } from './field-item-autocomplete.type';

@Component({
  selector: 'app-field-autocomplete',
  standalone: true,
  templateUrl: './field-autocomplete.component.html',
  styleUrls: ['./field-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    KeyValuePipe,
  ],
})
export class FieldAutocompleteComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject<void>();
  readonly executeOnEmailAdd$ = new Subject<MatChipInputEvent>();
  readonly fieldControl = new FormControl('');
  readonly itemsSelected: Map<string, string> = new Map();

  @Input() set itemsToBeSelected(items: FieldItemAutocomplete[]) {
    console.log("items", items)
    if(items?.length) {
      items.forEach(item => this.itemsSelected.set(item.id, item.name));
    }
  }
  @Input() allItemList: FieldItemAutocomplete[];
  @Output() outputItemsSelected = new EventEmitter<Map<string, string>>();
  filteredOptions: Observable<FieldItemAutocomplete[]>;

  ngOnInit() {
    this.filteredOptions = this.fieldControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItem(value || '')),
      takeUntil(this.onDestroy$),
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.itemsSelected.set(event.option.id, event.option.value);
    this.outputItemsSelected.emit(this.itemsSelected);
    this.fieldControl.patchValue(null);
  }

  onRemoveItem(id: string) {
    this.itemsSelected.delete(id);
    this.outputItemsSelected.emit(this.itemsSelected);
  }

  private filterItem(value: string): any[] {
    const filterValue = value?.toLowerCase();
    return this.allItemList?.filter(item =>
      item.name?.toLowerCase().includes(filterValue),
    );
  }
}
