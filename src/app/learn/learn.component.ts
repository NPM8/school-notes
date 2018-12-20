import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DataService} from '../services/data.service';
import {switchMap, take} from 'rxjs/operators';
import {Lesson} from '../interfaces/lesson';
import {Fisk} from '../interfaces/fisk';
import {of, Observable, interval, range, observable} from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

function randomDelay(bottom: number, top:  number) {
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}


// @ts-ignore
@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {

  lessonId: number;
  lernObj: Fisk[];
  actulaFisk: Fisk;
  showTrl: boolean;

  @Input() lessons: number[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DataService
  ) { }

  ngOnInit() {
    this.lessonId = +this.route.snapshot.paramMap.get('id');
    this.getLesson();
    this.play().subscribe(x => {
      this.showTrl = true;
      this.actulaFisk = x;
      setTimeout(() => {
        this.showTrl = false;

      }, 1000);
    });
  }

  getLesson(): void {

    this.service.getLesson(this.lessonId)
      .subscribe(lesson => this.lernObj.concat(lesson.fawkes));
  }

  random(max:  number): Observable<number> {
    return range(1, max).pipe(delay(randomDelay(100, 300)));
  }

  play(): Observable<Fisk> {
      return new Observable<Fisk>(obs => {
        const arr: number[] = [];
        this.random(this.lernObj.length).subscribe(value => arr.push(value));
        const int = interval(2500).pipe(take(this.lernObj.length));
        int.subscribe(x => {
          const num: number = arr[x];
          obs.next(this.lernObj[num]);
        }, null, () => obs.complete());
      });
  }
}
