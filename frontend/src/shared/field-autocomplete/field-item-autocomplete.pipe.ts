import { Pipe, PipeTransform } from '@angular/core';
import { FieldItemAutocomplete } from './field-item-autocomplete.type';

@Pipe({
  name: 'fieldItemAutocomplete',
  standalone: true,
})
export class FieldAutocompletePipe implements PipeTransform {
  transform(data: any): FieldItemAutocomplete[] {
    return data?.map(({id, name}) => ({id, name})) ?? [];
  }
}
