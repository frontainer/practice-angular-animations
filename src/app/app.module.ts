import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MdButtonModule,
  MdInputModule,
  MdRadioModule,
  MdListModule,
  MdCheckboxModule,
  MdIconModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { TodoService } from './shared/services/todo.service';
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
    BrowserAnimationsModule,
    FormsModule,
    MdButtonModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCheckboxModule,
    MdIconModule
  ],
  providers: [
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
