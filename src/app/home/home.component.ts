import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoService } from '../shared/services/todo/todo.service';
import { TodoItem } from '../shared/services/todo/todo.model';

import { MdRadioChange } from '@angular/material';

import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation,
  query, // <- 追加
  stagger, // <- 追加
  group,
  animateChild
} from '@angular/animations';
import { slideFadeIn, slideFadeOut } from '../app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // 追加ここから
  animations: [
    trigger('stateEffect', [
      state('complete', style({
        backgroundColor: '#eee'
      })),
      transition('* => complete', [
        style({
          backgroundColor: '#fff'
        }),
        animate('200ms ease-out', style({
          backgroundColor: '#eee'
        }))
      ]),
      transition('* => todo', [
        style({
          backgroundColor: '#eee'
        }),
        animate('200ms ease-in', style({
          backgroundColor: '#fff'
        }))
      ])
    ]),
    // 追加ここから
    trigger('slideFade', [
      transition('* => *', [
        group([ // <- 追加
          query(':leave', [
            useAnimation(slideFadeOut)
          ], { optional: true }),
          query(':enter', [
            stagger(50, [
              useAnimation(slideFadeIn)
            ])
          ], { optional: true })
        ]) // <- 追加
      ])
    ])
    // 追加ここまで
  ]
  // 追加ここまで
})
export class HomeComponent implements OnInit {
  public list: Observable<TodoItem[]>;
  public searchWord = '';
  public filterState = 'all';
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

  constructor(private todoService: TodoService) {
  }

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
    }
  }
}
