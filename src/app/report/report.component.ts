import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  topicId: any;
  topic: string;
  sub_topic: string;
  listTopic = [];

  constructor(private app: AppService) { }

  ngOnInit() {
    this.getConfigReport();
  }

  getConfigReport() {
    this.app.get('/report/getConfigReport').subscribe(data => {
      this.listTopic = data['msg'];

      console.log(data['msg'])
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
  }

  addSubTopic() {
    if (this.sub_topic) {
      this.app.post('/report/addTopic?accessToken=' + this.app.getToken(), { topic: this.sub_topic, ref: this.topicId }).subscribe(data => {
        this.getConfigReport();
        this.clear();
      })
    }
  }

  clear() {
    this.topic = null;
    this.sub_topic = null;
    $('#create').removeClass('show');
  }

}
