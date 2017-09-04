import { Pipe, PipeTransform } from '@angular/core';
import { TodoItem } from '../services/todo/todo.model';

@Pipe({
  name: 'todoSearch'
})
export class TodoSearchPipe implements PipeTransform {
  transform(items: TodoItem[], word: string): any {
    return items.filter((item: TodoItem) => {
      return (item.value.indexOf(word) !== -1);
    });
  }
}