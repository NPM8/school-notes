import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class LearnComponent implements OnInit, OnChanges {

  lessonId: number;
  lernObj: Fisk[];
  actulaFisk: Fisk;
  showTrl: boolean;
  showEnd: boolean;
  isStarted: boolean;
  firstTime: boolean;

  @Input() lessons: number[];
  @Output() end = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DataService
  ) {
    this.firstTime = false;
  }

  ngOnInit() {
    this.lessonId = +this.route.snapshot.paramMap.get('id');
    this.lernObj = [];
    // this.getLesson();
    this.actulaFisk = {
      pl: 'strat',
      en: 'start'
    };
    // this.play().subscribe(x => {
    //   this.showTrl = true;
    //   this.actulaFisk = x;
    //   setTimeout(() => {
    //     this.showTrl = false;
    //   }, 1000);
    // });
  }

  startGame() {
    if (!this.isStarted) {
      console.log('stared:  ');
      this.isStarted = !this.isStarted;
      this.play().subscribe(x => {
        console.log(x);
        this.showTrl = true;
        this.actulaFisk = x;
        setTimeout(() => {
          this.showTrl = false;
          const u = new SpeechSynthesisUtterance();
          u.text = x.en;
          u.lang = 'en-US';
          u.rate = 1.2;
          speechSynthesis.speak(u);
        }, 2000);
      }, null, ()  => {
        setTimeout(() => {
          this.isStarted = !this.isStarted;
          this.showEnd = true;
        }, 4500);
      });
    }

  }

  handleEnd() {
    this.showEnd = false;
    this.end.emit(true);
  }

  getLesson(): void {
    if (!this.firstTime) {
      this.lernObj = [];
      this.firstTime = !this.firstTime;
      this.lessons.forEach(x => {
        this.service.getLesson(x)
          .subscribe(lesson => { this.lernObj = this.lernObj.concat(lesson.data); console.log('less: ', lesson); },
            null, () => console.log('lern: ', this.lernObj));
      });
    }
  }

  random(max:  number): Observable<number> {
    return range(0, max ).pipe(delay(randomDelay(100, 1000)));
  }

  play(): Observable<Fisk> {
      return new Observable<Fisk>(obs => {
        const arr: number[] = [];
        this.random(this.lernObj.length).subscribe(value => arr.push(value));

        const int = interval(4500).pipe(take(this.lernObj.length));
        int.subscribe(x => {
          console.log(arr);
          const num: number = arr[x];
          obs.next(this.lernObj[num]);
        }, null, () => obs.complete());
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getLesson();
  }
}
