import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {Lesson} from '../interfaces/lesson';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css']
})
export class AdminlistComponent implements OnInit {

  lessons: Lesson[];
  name: string;
  addname: string;
  accID: number;
  showEdit: boolean;
  showAdd: boolean;
  constructor(private service:  DataService) { }

  ngOnInit() {
    this.getLessons();
  }

  getLessons() {
    this.service.getLessons().subscribe(x => {
      this.lessons = x;
    });
  }

  handleChange(evt: any) {
    this.name = evt.target.value;
  }

  handleDeletePress(id: number) {
    this.service.removeLesson(id).subscribe(x => this.lessons = x);
  }

  handleSetName() {
    this.showEdit = false;
    this.service.setName(this.accID, this.name).subscribe(x => {
      this.getLessons();
    }, null, () => this.showEdit = false);
  }

  closeModalEdit() {
    this.showEdit = false;
  }

  hadleAdd() {
    this.service.addLesson(this.addname).subscribe(x => {
      this.lessons = x;
    }, null, () => this.showAdd = false);
  }

  hadnleAddChange(evt: any) {
    this.addname = evt.target.value;
  }

  handleClickShowSetName(id: number, name:  string) {
    this.name = name;
    this.accID = id;
    this.showEdit = true;
  }
}
