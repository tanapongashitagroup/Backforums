import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-report-example',
  templateUrl: './report-example.component.html',
  styleUrls: ['./report-example.component.css']
})
export class ReportExampleComponent implements OnInit {

  topicID: any;
  subtopicID: any;
  listTopic = [];
  listSupTopic = [];
  phone: string;
  email: string;
  comment: string;
  response: string;

  constructor(private app: AppService) { }

  ngOnInit() {
    this.getConfigReport();
  }

  getConfigReport() {
    this.app.get('/report/getConfigReport').subscribe(data => {
      this.listTopic = data['msg'];
    })
  }

  selectTopic(obj: any) {
    this.topicID = obj._id;
    this.listTopic.forEach(i => {
      if (i._id == obj._id) {
        this.listSupTopic = i.subTopic
      }
    })
  }

  selectSubTopic(obj: any) {
    this.subtopicID = obj._id;
  }

  sendReport() {
    this.validate(cb => {
      if (cb == true) {
        var save = {
          topic_id: this.topicID,
          supTopic_id: this.subtopicID,
          comment: this.comment,
          email: this.email,
          phone: this.phone,
        }

        this.app.post('/report/sendReport', save).subscribe(data => {
          this.response = 'success'
          setTimeout(() => {
            this.clear();
          }, 2000);
        })

      } else {
        this.response = cb
        setTimeout(() => {
          this.response = null;
        }, 2000);
      }
    })
  }

  validate(cb) {
    if (!this.subtopicID) {
      cb('กรุณาเลือกหัวข้อเหตุผลของการรายงาน')

    } else if (!this.comment) {
      cb('กรุณาป้อนข้อมูลรายละเอียด')

    } else if (!this.app.validateEmail(this.email)) {
      cb('รูปแบบอีเมล์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')

    } else if (!this.phone) {
      cb('กรุณาป้อนข้อมูลเบอร์ติดต่อ')

    } else {
      cb(true)
    }
  }

  clear() {
    this.phone = null;
    this.email = null;
    this.comment = null;
    this.response = null;
    this.listSupTopic = [];
  }

}
