import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  topicId: any;
  topic: string;
  edit_topic: string;
  sub_topic: string;
  listTopic = [];

  constructor(private app: AppService) { }

  ngOnInit() {
    this.getConfigReport();
  }

  getConfigReport() {
    this.app.get('/report/getConfigReport').subscribe(data => {
      this.listTopic = data['msg'];
    })
  }

  saveTopic() {
    if (this.topic) {
      this.app.post('/report/addTopic?accessToken=' + this.app.getToken(), { topic: this.topic }).subscribe(data => {
        this.listTopic.push(data['msg'])
        this.clear();
      })
    }
  }

  getTopic(obj: any) {
    this.topicId = obj._id;
    this.edit_topic = obj.topic;
  }

  addSubTopic() {
    if (this.sub_topic) {
      this.app.post('/report/addTopic?accessToken=' + this.app.getToken(), { topic: this.sub_topic, ref: this.topicId }).subscribe(data => {
        this.getConfigReport();
        $('.modalAddSubTopic').modal('toggle');
        this.clear();
      })
    }
  }

  updateTopic() {
    this.app.post('/report/updateTopic?accessToken=' + this.app.getToken(), { _id: this.topicId, topic: this.edit_topic }).subscribe(data => {
      this.getConfigReport();
      $('.modalEditTopic').modal('toggle');
    })
  }

  deleteTopic(obj: any) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {

      this.app.post('/report/deleteTopic?accessToken=' + this.app.getToken(), { _id: obj._id }).subscribe((data) => {
        if (data['status']) {
          this.getConfigReport();

          swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else {
          swal(
            'Cancelled',
            data['msg'],
            'error'
          )
        }
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

  clear() {
    this.topic = null;
    this.sub_topic = null;
  }

}
