import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { CropperSettings } from 'ng2-img-cropper';
declare var $: any;

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  dataAvatar: any;
  cropAvatar: CropperSettings;
  _id: any;
  index: number;
  avatar: string;
  email_new: string;

  listUser = [];
  listPermission = [];
  select: string;

  constructor(public app: AppService) { }

  ngOnInit() {
    this.cropAvatar = new CropperSettings();
    this.cropAvatar.width = 160; // ตัว crop
    this.cropAvatar.height = 160;
    this.cropAvatar.croppedWidth = 160;  // ขนาดรูปที่ save ออกมา
    this.cropAvatar.croppedHeight = 160;
    this.cropAvatar.canvasWidth = 400;  // กล่องตัว upload
    this.cropAvatar.canvasHeight = 300;
    this.dataAvatar = {};

    this.getMember();

  }

  getMember() {
    this.app.get('/member?accessToken=' + this.app.getToken()).subscribe((data: any) => {
      if (data) {
        this.listUser = data;
        this.getPermission();
      }
    })
  }

  changePermission(uid, value) {
    this.app.post('/member/update/permission?accessToken=' + this.app.getToken(), { uid: uid, permissionId: value }).subscribe(data => {
      console.log(value);
    })
  }

  getPermission() {
    this.app.get('/permission').subscribe((data: any) => {
      this.listPermission = data;
    })
  }

  editMember(obj: any, index: number) {
    this._id = obj._id;
    this.index = index;
    this.avatar = (obj.picture) ? obj.picture : null;
  }

  updateAvatar() {
    if (this.dataAvatar.image) {
      this.app.postImg('/api/updatePicture', { folder: 'users', img_old: this.avatar, img_new: this.dataAvatar.image }).subscribe(serv => {
        if (serv['rescode'] == 1) {
          var update = { _id: this._id, picture: serv['msg'] }
          this.app.post('/member/updateAvatar?accessToken=' + this.app.getToken(), update).subscribe(res => {
            this.listUser[this.index].picture = res['msg']
            $('.modalAvatar').modal('toggle');

          })
        } else {
          console.log('cannot upload.')
        }
      })
    } else {
      console.log('image is empty.')
    }
  }

  editEmail(obj: any, index: number) {
    this._id = obj._id;
    this.index = index;
  }

  updateEmail() {
    if (!this.app.validateEmail(this.email_new)) {
      console.log('รูปแบบอีเมล์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
    } else {
      this.app.post('/member/updateEmail?accessToken=' + this.app.getToken(), { _id: this._id, email: this.email_new }).subscribe(data => {
        if (data['status']) {
          this.listUser[this.index].email = this.email_new
          $('.modalEmail').modal('toggle');

        } else {
          console.log(data['message'])
        }
      })
    }
  }

}
