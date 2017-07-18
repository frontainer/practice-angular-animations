import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TodoItem } from '../models/todo';

@Injectable()
export class TodoService {
  private subject: BehaviorSubject<TodoItem[]> = new BehaviorSubject([]);
  private _list: TodoItem[] = [];
  private _type: string = 'all';

  constructor() {
    const data: string = <string>window.localStorage.getItem('list');
    if (data) {
      this._list = JSON.parse(data);
    }

    this.subject.subscribe(() => {
      this._update();
    });
  }

  get items(): Observable<TodoItem[]> {
    return this.subject.asObservable();
  }

  _findById(id: number): TodoItem | undefined {
    return this._list.find((item: TodoItem) => {
      return (item.id === id);
    });
  }
  _findIndexById(id: number): number {
    return this._list.findIndex((item: TodoItem) => {
      return (item.id === id);
    });
  }
  _filterByState(state: string): TodoItem[] {
    switch (state) {
      case 'all':
        return this._list;
      case 'complete':
        return this._list.filter((item) => {
          return (item.state === state);
        });
      case 'todo':
        return this._list.filter((item) => {
          return (item.state === state);
        });
      default:
        break;
    }
    return [];
  }
  _update() {
    window.localStorage.setItem('list', JSON.stringify(this._list));
  }

  add(value: string) {
    this._list.unshift({
      id: Date.now(),
      state: 'todo',
      value
    });
    this.subject.next(this._list.slice());
  }
  changeState(id: number) {
    const hit: TodoItem | undefined = this._findById(id);
    if (hit) {
      if (hit.state === 'complete') {
        hit.state = 'todo';
      } else {
        hit.state = 'complete';
      }
    }
    this.subject.next(this._filterByState(this._type).slice());
  }
  delete(id: number) {
    const hit: number = this._findIndexById(id);
    if (hit !== -1) {
      this._list.splice(hit, 1);
    }
    this.subject.next(this._filterByState(this._type).slice());
  }
  refresh() {
    this._update();
    this.subject.next(this._list.slice());
  }
  filter(type: string) {
    this._type = type;
    this.subject.next(this._filterByState(this._type).slice());
  }
  clearComplete() {
    this._list = this._filterByState('todo');
    this.subject.next(this._list.slice());
  }
}
