import { ActivatedRoute } from '@angular/router';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-views',
  templateUrl: './report-views.component.html',
  styleUrls: ['./report-views.component.css']
})
export class ReportViewsComponent implements OnInit {

  _id: any;
  topic: string;
  listReport = [];

  constructor(private app: AppService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this._id = data['_id'];
      this.getTopicByID();
    })
  }

  getTopicByID() {
    this.app.get('/report/getTopicByID/' + this._id).subscribe(data => {
      console.log(data)
      var r = data['msg']
      if (r) {
        this.topic = r.topic
        this.listReport = r.dataReport;
      }

    })
  }

}
