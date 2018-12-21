import { Component, OnInit } from '@angular/core';
import {Lesson} from '../interfaces/lesson';
import { LearnComponent } from '../learn/learn.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  list:  number[];
  showLessons: boolean;

  constructor() { }

  ngOnInit() {
    this.showLessons = true;
  }

  hadnleStart(list: number[]) {
    console.log(list);
    this.list = list;
    this.showLessons = false;
  }

  handleEnd() {
    this.showLessons = true;
    this.list = [];
  }
}
