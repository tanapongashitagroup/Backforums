import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-config-pageviews',
  templateUrl: './config-pageviews.component.html',
  styleUrls: ['./config-pageviews.component.css']
})
export class ConfigPageviewsComponent implements OnInit {

  listConfig = []
  class: string;
  edit_class: string;
  pageviews: any;
  edit_pageviews: any;
  index: number;
  response: string;
  _id: any;

  constructor(private app: AppService) { }

  ngOnInit() {
    this.getAllConfigPageviews();
  }

  getAllConfigPageviews() {
    this.app.get('/level/getAllConfigPageviews').subscribe(data => {
      this.listConfig = data['msg']
    })
  }

  addConfigPageviews() {
    this.validate(cb => {
      if (cb == true) {
        this.app.post('/level/addConfigPageviews?accessToken=' + this.app.getToken(), { class: this.class, pageviews: this.pageviews }).subscribe(data => {
          this.listConfig.push(data['msg'])
          this.response = 'success';
          setTimeout(() => {
            this.clear();
          }, 1000);

        })
      } else {
        this.response = cb;
        setTimeout(() => {
          this.response = null;
        }, 1000);
      }
    })
  }

  getConfigPageviews(obj: any, index: number) {
    this._id = obj._id;
    this.class = obj.class;
    this.pageviews = obj.pageviews;
    this.index = index;
  }

  updateConfigPageviews() {
    var update = { _id: this._id, class: this.class, pageviews: this.pageviews }
    this.app.post('/level/updateConfigPageviews?accessToken=' + this.app.getToken(), update).subscribe(data => {
      this.listConfig[this.index] = data['msg'];
      $('.modalConfigPageviews').modal('toggle');
    })
  }

  deleteConfigPageviews(obj: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {
      this.app.post('/level/deleteConfigPageviews?accessToken=' + this.app.getToken(), { _id: obj._id }).subscribe(data => {
        this.listConfig.splice(index, 1)

        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      })

    }, (dismiss) => {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer' 
      if (dismiss === 'cancel') {
        swal(
          'Cancelled',
          'Your file is safe :)',
          'error'
        )
      }
    })


  }

  validate(cb) {
    if (this.app.isEmpty(this.class)) {
      cb('class name is empty.')
    } else if (this.app.isEmpty(this.pageviews)) {
      cb('number pageviews is empty..')
    } else {
      cb(true)
    }
  }

  clear() {
    this.class = null;
    this.pageviews = null;
    this.response = null;
  }

}
