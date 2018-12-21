import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {Fisk} from '../interfaces/fisk';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-adminedit',
  templateUrl: './adminedit.component.html',
  styleUrls: ['./adminedit.component.css']
})
export class AdmineditComponent implements OnInit {

  id: number;
  editedId: number;
  name: string;
  fisks: Fisk[];
  edited: Fisk;
  toAdd: Fisk;
  showEdit: boolean;
  showAdd: boolean;

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.showEdit = false;
    this.showAdd = false;
    this.toAdd = {
      pl: '',
      en: ''
    };
    this.edited = {
      pl: '',
      en: ''
    };
    this.getLesson(this.route.snapshot.params.id);
  }

  getLesson(id: number)  {
    this.service.getLesson(id).subscribe(x => {
      this.id = x.id;
      this.name = x.name;
      this.fisks = x.data;
    });
  }

  edit(id: number) {
    this.service.editFisk(this.id, id, this.edited.pl, this.edited.en).subscribe(x => {
      this.id = x.id;
      this.name = x.name;
      this.fisks = x.data;
    });
  }

  handleEditClick(id: number) {
    this.edited = this.fisks[id];
    this.editedId = id;
    this.showEdit = true;
  }

  handleChange(evt: any, id: string) {
    this.edited[id] = evt.target.value;
  }

  handleAddChange(evt: any, id: string) {
  this.toAdd[id] = evt.target.value;
}

  add() {
    this.service.addFisk(this.id, this.toAdd.pl, this.toAdd.en).subscribe(x => {
      this.id = x.id;
      this.name =  x.name;
      this.fisks =  x.data;
    });
  }

  delete(id: number) {
    this.service.removeFisk(this.id, id).subscribe(x => {
      this.id = x.id;
      this.name = x.name;
      this.fisks = x.data;
    });
  }
}
