import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Lesson} from '../interfaces/lesson';
import {DataService} from '../services/data.service';
import {FormBuilder, FormControl, FormGroup, FormArray} from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  checked: FormGroup;
  lessons: Lesson[];
  @Input() chnage: any;
  @Output() start = new EventEmitter<number[]>();
  constructor(
    private service: DataService,
    private formBuilder: FormBuilder,
  ) {
    this.lessons = [];
    let controls = this.lessons.map(c => new FormControl(false));
    // controls[0].setValue(true); // Set the first checkbox to true (checked)

    this.checked = this.formBuilder.group({
      lessons: new FormArray(controls)
    });
    this.service.getLessons().subscribe(x => {
      this.lessons = x;
      console.log(x);
      controls = this.lessons.map(c => new FormControl(false));
      controls[0].setValue(true); // Set the first checkbox to true (checked)

      this.checked = this.formBuilder.group({
        lessons: new FormArray(controls)
      });
    });
  }

  ngOnInit() {
    // this.service.getLessons().subscribe(x => {
    //   this.lessons = x;
    //   console.log(x);
    //   const controls = this.lessons.map(c => new FormControl(false));
    //   controls[0].setValue(true); // Set the first checkbox to true (checked)
    //
    //   this.checked = this.formBuilder.group({
    //     lessons: new FormArray(controls)
    //   });
    // });
    // this.service.setName(4, 'test').subscribe(x => console.log(x));
  }

  // changeHandler(evnt: any) {
  //   // console.log(evnt);
  //   const index =  this.checked.indexOf(evnt);
  //   if (index > -1) {
  //     this.checked.splice(index, 1);
  //   } else {
  //     this.checked.push(evnt);
  //   }
  // }
  //
  // handleSelectAll() {
  //   if (this.checked.length < this.lessons.length) {
  //     this.lessons.forEach(x => {
  //       const index = this.checked.indexOf(x.id);
  //       if (index === -1) {
  //         this.checked.push(x.id);
  //       }
  //     });
  //   } else {
  //     this.checked;
  //   }
  // }

  checkAll(e: any) {
    e.preventDefault();
    for( let key in this.checked.controls.lessons['controls'] ) {
      this.checked.controls.lessons['controls'][ key ].setValue( !this.checked.value.lessons[ key ] );
    }
  }

  submit() {
    const selectedOrderIds = this.checked.value.lessons
      .map((v, i) => v ? this.lessons[i].id : null)
      .filter(v => v !== null);

    this.start.emit(selectedOrderIds);
  }

}
