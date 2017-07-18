import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoService } from '../shared/services/todo.service';
import { TodoItem } from '../shared/models/todo';

import { MdRadioChange } from '@angular/material';

import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation,
  query,
  stagger,
  group
} from '@angular/animations';
import { slideFadeIn, slideFadeOut } from '../app.animations';

@Component({
  selector: 'et-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('stateEffect', [
      state('complete', style({
        backgroundColor: '#eee'
      })),
      transition('todo => complete', [
        style({
          backgroundColor: '#fff'
        }),
        animate('200ms ease-out', style({
          backgroundColor: '#eee'
        }))
      ]),
      transition('complete => todo', [
        style({
          backgroundColor: '#eee'
        }),
        animate('200ms ease-in', style({
          backgroundColor: '#fff'
        }))
      ])
    ]),
    trigger('slideFade', [
      transition('* => *', [
        group([
          query(':leave', [
            useAnimation(slideFadeOut)
          ], { optional: true }),
          query(':enter', [
            stagger(50, [
              useAnimation(slideFadeIn)
            ])
          ], { optional: true })
        ])
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {
  public list: Observable<TodoItem[]>;
  public searchWord: string = '';
  public filterState: string = 'all';
  public filterItems = [
    {
      name: 'all',
      label: 'すべて'
    },
    {
      name: 'complete',
      label: '完了'
    },
    {
      name: 'todo',
      label: '未完了'
    }
  ];
  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit() {
    this.list = this.todoService.items;
    this.todoService.refresh();
  }

  add(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    if (input.value) {
      this.reset();
      this.todoService.add(input.value);
      input.value = '';
    }
  }
  reset() {
    this.filterState = 'all';
    this.todoService.filter(this.filterState);
  }
  changeState(id: number) {
    this.todoService.changeState(id);
  }
  changeFilter(event: MdRadioChange) {
    this.todoService.filter(event.value);
  }
  delete(id: number) {
    this.todoService.delete(id);
  }
  clearComplete() {
    if (window.confirm('完了したタスクをすべて削除してよろしいですか？')) {
      this.todoService.clearComplete();
      this.reset();
    }
  }
}
