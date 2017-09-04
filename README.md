## 前提
Node.js 6 or 8をローカルにインストールしていること

## 環境構築

Angular CLIをインストールしましょう

```
npm i @angular/cli -g
```

プロジェクトを作成するディレクトリで次のコマンドを実行

```
ng new animation-workshop --routing --style=scss
```

- --routing ルーティングを使うアプリケーションを構築する宣言（`app-routing.module.ts`ができる）
- --style コンポーネントで使うcssの種類（css/scss/sassなど）

以上で準備完了！

## サーバー起動

次のコマンド実行後に`localhost:4200`にアクセス

```
ng serve
```

※ 環境によって関連ファイルのインストールに失敗していることがあるので、もしエラーがでたら `npm i` を実行してから改めてserveしてみよう。

![AnimationWorkshop - http___localhost_4200_.png (162.7 kB)](https://img-esa-emotion-tech.s3-ap-northeast-1.amazonaws.com/uploads/production/attachments/2271/2017/07/18/17433/73df7f3c-b96f-4e35-9d11-0efb0abca909.png)

この状態でコードを変更すると勝手にビルドして更新してくれるよ！

## 新しいコンポーネントを作る

homeコンポーネントを作るよ！
ng generate（エイリアス: `ng g`）を使うと簡単。

```
ng g component home
```

ファイルを作ってModuleにも参照を追加してくれるよ！
```
create src/app/home/home.component.scss
create src/app/home/home.component.html
create src/app/home/home.component.spec.ts
create src/app/home/home.component.ts
update src/app/app.module.ts
```

## ルーティング

このままだとhomeにアクセスできないのでルーティングを足しますよ！

``` app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'; // <- 追加

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // <- 追加
    children: [
      { // 追加ここから
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      } // 追加ここまで
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

トップページにいらないテンプレが書いてあるので次のものだけにしてしまいます。

```app.component.html
<router-outlet></router-outlet>
```

![AnimationWorkshop - http___localhost_4200_2.png (82.8 kB)](https://img-esa-emotion-tech.s3-ap-northeast-1.amazonaws.com/uploads/production/attachments/2271/2017/07/18/17433/3097b8d7-cc23-4548-82d1-5504ddf22d13.png)

できた！

## @angular/materialいれよう

```
npm i -S @angular/material @angular/cdk
```

※cdk - component dev kit. もともと@angular/coreにあったものが切り出されたもの

スタイルテーマを追加
```styles.scss
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
md-list-item {
  overflow: hidden;
}
```

app.moduleに使いたいモジュールをimportしておくよ！
```app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-追加
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-追加

// 追加ここから
import {
  MdButtonModule,
  MdInputModule,
  MdRadioModule,
  MdListModule,
  MdCheckboxModule,
  MdIconModule
} from '@angular/material';
// 追加ここまで

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // 追加ここから
    BrowserAnimationsModule,
    FormsModule,
    MdButtonModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCheckboxModule,
    MdIconModule
    // 追加ここまで
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## ToDo保持のService作成

ToDoを保持するServiceを作りますよ！
```
ng g service shared/services/todo/todo
```

> WARNING Service is generated but not provided, it must be provided to be used

ServiceはModuleに勝手に読み込まれないので注意です。

Serviceで使う型定義書くファイルも一緒に作りましょう。
```
ng g interface shared/services/todo/todo model
```

```shared/services/todo/todo.model.ts
export interface TodoItem {
  id: number;
  state: string;
  value: string;
}
```

作った型定義を読み込むよ！

```shared/services/todo.service.ts
import { Injectable } from '@angular/core';
import { TodoItem } from './todo.model'; // <-追加

@Injectable()
export class TodoService {
  constructor() { }
}
```

### Service作り込み

``` shared/services/todo.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TodoItem } from './todo.model';

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
```

```app.module.ts
import { TodoService } from './shared/services/todo/todo.service';

@NgModule({
 // ...略
  providers: [
    TodoService
  ],
  // ...略
})
```

## Pipe作る

ToDoをテキストで絞り込むためのPipeを作るよ！

```
ng g pipe shared/pipes/todoSearch 
```


```shared/pipes/todo-search.ts
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
```

## これまで作ったものをコンポーネントに

```home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoService } from '../shared/services/todo/todo.service';
import { TodoItem } from '../shared/services/todo/todo.model';

import { MdRadioChange } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
    }
  }
}

```

```home/home.component.html
<form action="" (submit)="add($event, input)">
  <md-input-container>
    <input mdInput placeholder="TODO" #input>
  </md-input-container>
  <button md-raised-button>追加</button>
</form>

<form action="">
  <md-input-container>
    <input mdInput name="search" [(ngModel)]="searchWord" placeholder="検索ワード">
  </md-input-container>
  <md-radio-group class="example-radio-group" (change)="changeFilter($event)" [(ngModel)]="filterState" name="filter">
    <md-radio-button class="example-radio-button" *ngFor="let item of filterItems" [value]="item.name">{{item.label}}
    </md-radio-button>
  </md-radio-group>
</form>

<button md-raised-button color="warn" (click)="clearComplete()">完了したタスクを削除</button>

<md-list *ngIf="(list | async | todoSearch : searchWord) as items">
  <md-list-item *ngFor="let item of items" (click)="changeState(item.id)">
    <md-checkbox md-list-icon [checked]="item.state === 'complete'" (click)="$event.preventDefault()"></md-checkbox>
    <h4 md-line>{{item.value}}</h4>
    <p md-line>{{item.id | date : 'yyyy/MM/dd hh:mm'}}</p>
    <p>
      <md-icon (click)="delete(item.id)">delete</md-icon>
    </p>
  </md-list-item>
</md-list>
```

---

## アニメーション基本

```home/home.component.ts
import {
  transition,
  trigger,
  state,
  style,
  animate
} from '@angular/animations';

// ...略

@Component({
  selector: 'et-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // <- 「,」忘れずに
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
    ])
  ]
  // 追加ここまで
})
```

```home/home.component.html 21行目
<md-list-item *ngFor="let item of items" (click)="changeState(item.id)" [@stateEffect]="item.state">
```

`[@stateEffect]="item.state"`を追加しました。
そうするとチェックをつけるとアニメーションして背景色が変わりますよ！

### ポイント
1. tirggerでアニメーションする対象と状態を受け取る
2. transitionを用いて変化によって処理を振り分け
3. styleやanimateを使ってスタイルを変えたりアニメーションさせたり
4. 最終的なスタイルはstateとstyleで定義しよう（しないと元に戻るぞ）


### transition

`FROM => TO` の形で記述します。
双方向もできますよ！ `A <=> B`

何もない状態から変化するときは`void`を使います。

エイリアスとして`:enter`と`:leave`があります。
`:enter` は `void => *` と同じ意味で`:leave`は `* => void`と同じです。

## アニメーションテンプレート

4.2で追加されたanimation関数を使うことで共通に使うアニメーションの定義をすることができます。パラメータで実行時間などは変更できるので、ある程度汎用的に作れる様になりますよ！

```
ng g class app.animations
```

代表的なフェードイン・フェードアウトを書いてみましょう。

```app.animations.ts
import {
  style,
  animate,
  animation
} from '@angular/animations';

export const slideFadeIn = animation([
  style({
    opacity: 0,
    transform: 'translateX(2%)'
  }),
  animate('{{time}} {{easing}}', style({
    opacity: 1,
    transform: 'translateX(0)'
  }))
], {
  params: {
    time: '.5s',
    easing: 'ease-out'
  }
});
export const slideFadeOut = animation([
  style({
    opacity: 1,
    height: '*'
  }),
  animate('{{time}} {{easing}}', style({
    opacity: 0,
    height: 0
  }))
], {
  params: {
    time: '.5s',
    easing: 'ease-out'
  }
});
```

## アニメーションを適用する

必要な関数と先ほど作ったテンプレを呼び出します。

```home/home.component.ts
import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation // <- 追加
} from '@angular/animations';
import { slideFadeIn, slideFadeOut } from '../app.animations'; // <- 追加
```

componentのanimationsにアニメーションを定義を追加しますよ！

```home/home.component.ts
@Component({
  selector: 'et-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // <- 「,」忘れずに
  animations: [
    // ...略
    // 追加ここから
    trigger('slideFade', [
      transition(':enter', [
        useAnimation(slideFadeIn)
      ]),
      transition(':leave', [
        useAnimation(slideFadeOut)
      ])
    ])
    // 追加ここまで
  ]
})
```

```home/home.component.html 21行目
<md-list-item *ngFor="let item of items" (click)="changeState(item.id)" [@stateEffect]="item.state" @slideFade>
```

`@slideFade`を追加しました。

useAnimation animationで定義したテンプレを使ってアニメーションを実行します。第２引数にパラメータを渡せるので、

```
transition(':enter', [
  useAnimation(slideFadeIn, {
    params: {
      time: '300ms',
      easing: 'ease-out'
    }
  })
])
```
としたら時間を変えたりイージング変えたりできます。
いろいろと応用できそうですね。

## リストアニメーション

リストがあるとアイテムごとにアニメーションにディレイをつけたくなりますよね。

```
import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation,
  query, // <- 追加
  stagger // <- 追加
} from '@angular/animations';
// ...略
// slideFade置き換えここから
trigger('slideFade', [
  transition('* => *', [
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
// slideFade置き換えここまで
```

```home/home.component.html 20行目
<md-list *ngIf="(list | async | todoSearch : searchWord) as items" [@slideFade]="items">
  <md-list-item *ngFor="let item of items" (click)="changeState(item.id)" [@stateEffect]="item.state">
```

`[@slideFade]="items"` を追加しました。
同時にmd-list-itemに書いていた`slideFade`の記述を削除しました。

すべて・完了・未完了で切り替えてみるとディレイがついてアニメーションしています。
が、ちょっとぎこちない動きですよね。

## アニメーションを同時実行

デフォルトではアニメーションは配列の順番に実行されていきます。
現状は切り替えると、アイテムが消えてから、その後に出てくるアニメーションが実行されているためぎこちない動きになっています。

アニメーション同時実行させますよ！

```home/home.component.ts
import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation,
  query,
  stagger,
  group // <- 追加
} from '@angular/animations';

// ...略
// slideFade置き換えここから
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
// slideFade置き換えここまで
```

これで消えつつ表示されるようになりました。

## まとめ

動的にパラメータ変更はまだできないですが、アプリケーション構築する分には問題ないレベルになっています。でもまだExperimentalのステータスなので今後も変わるかもしれませんけどね！
