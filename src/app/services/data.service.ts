import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Fisk} from '../interfaces/fisk';
import {catchError} from 'rxjs/operators';
import {Lesson} from '../interfaces/lesson';
import {Observable} from 'rxjs';
import {retry, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://91.21.193.231:9000/api';

  public getOne(id: number): Observable<Fisk> {
    return this.http.get<Fisk>(`${this.baseUrl}/elem/${id}`).pipe(retry(3));
  }

  public getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons/list`);
  }

  public getLesson(id: number) {
    return this.http.get<Lesson>(`${this.baseUrl}/lessons/${id}`);
  }

  public setName(id: number, name: string) {
    return this.http.post<Lesson>(`${this.baseUrl}/lesson/edit/${id}`, { name: name }, httpOptions)
      .pipe(tap(() => console.log('Wszystko ok')));
  }

  public addLesson(name: string = '') {
    return this.http.post<Lesson[]>(`${this.baseUrl}/lesson/add`, { name: name}, httpOptions)
      .pipe(tap(() => console.log('Wszystko ok')));
  }

  public removeLesson(id: number) {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lesson/remove/${id}`)
      .pipe(tap(() => console.log('Wszystko ok')));
  }

  public removeFisk(id: number, fisk: number) {
    return this.http.get<Lesson>(`${this.baseUrl}/lesson/${id}/removefisk/${fisk}`)
      .pipe(tap(() => console.log('Wszystko ok')));
  }

  public addFisk(id: number, pl: string, en: string) {
    return this.http.post<Lesson>(`${this.baseUrl}/lesson/${id}/addfisk`, {pl, en}, httpOptions)
      .pipe(tap(() => console.log('wszystko ok')));
  }

  public editFisk(id: number, fisk: number, pl?: string, en?: string) {
    return this.http.post<Lesson>(`${this.baseUrl}/lesson/${id}/edit/${fisk}`, {pl, en}, httpOptions)
      .pipe(tap(() => console.log('wszystko ok')));
  }
}
