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
import { TodoService } from './shared/services/todo/todo.service';
import { TodoSearchPipe } from './shared/pipes/todo-search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TodoSearchPipe
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
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }