import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Fisk} from '../interfaces/fisk';
import {catchError} from 'rxjs/operators';
import {Lesson} from '../interfaces/lesson';
import {Observable} from 'rxjs';
import {retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/api';

  public getOne(id: number): Observable<Fisk> {
    return this.http.get<Fisk>(`${this.baseUrl}/elem/${id}`).pipe(retry(3));
  }

  public getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons/list`);
  }

  public getLesson(id: number) {
    return this.http.get<Lesson>(`${this.baseUrl}/lesson/${id}`);
  }
}
