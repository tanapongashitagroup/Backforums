import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-newpost-cms',
  templateUrl: './newpost-cms.component.html',
  styleUrls: ['./newpost-cms.component.scss']
})
export class NewpostCMSComponent implements OnInit {

  response: string;
  tags: any = [];
  title_th: string;
  content_th: string;
  slug: string;

  cropCover: CropperSettings;
  dataCover: any;

  contentOptions: Object = {
    imageManagerLoadURL: this.api.servImg + '/api/imgfroala',
    imageUploadURL: this.api.servImg + '/api/uploadfroala',
    imageManagerDeleteURL: this.api.servImg + '/api/deletefroala',
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true,  //แสดงจำนวนตัวอักษร
    toolbarInline: false, //ทำให้เหลือบรรทัดเดียว
    toolbarButtons: ['bold', 'italic', '|', 'paragraphFormat', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'html'],
    disableRightClick: true, //ห้ามคลิกขวา
    heightMin: 400,
    key: 'WrrnvhrhxD5B-13ol=='
  }

  constructor(public api: AppService, private router: Router) { }

  ngOnInit() {
    this.cropCover = new CropperSettings();
    this.cropCover.width = 1000; // ตัว crop
    this.cropCover.height = 600;
    this.cropCover.croppedWidth = 1000;  // ขนาดรูปที่ save ออกมา
    this.cropCover.croppedHeight = 600;
    this.cropCover.canvasWidth = 500;  // กล่องตัว upload
    this.cropCover.canvasHeight = 300;
    this.dataCover = {};
  }

  genSlug() {
    if (!this.api.isEmpty(this.title_th)) {
      this.slug = this.api.urlEncode(this.title_th)
    }
  }

  submit() {

    this.checkInput(check => {
      if (check == true) {

        this.api.postImg('/api/updatePicture', { folder: 'posts', img_old: null, img_new: this.dataCover.image }).subscribe(serv => {
          if (serv['rescode'] == 1) {
            var save = {
              title_th: this.title_th,
              slug: (this.slug) ? this.api.urlEncode(this.slug) : this.api.urlEncode(this.title_th),
              tags: this.tags,
              content_th: this.content_th,
              cover: serv['msg'],
              status: 'draft',
              date: this.api.getTime(),
            }

            this.api.post('/cms/createPost?accessToken=' + this.api.getToken(), save).subscribe(data => {
              if (data['status']) {
                this.response = 'success'
                setTimeout(() => {
                  this.router.navigate(['/dashboard/managepost'])
                }, 1000);

              } else {
                this.response = data['msg'];
                this.clear();
              }
            })
          } else {
            console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
          }
        })



      } else {
        this.response = check;
        this.clear();
      }
    })
  }

  onTagEdited(e: any) {
    // console.log(e)
  }

  checkInput(cb) {
    if (this.api.isEmpty(this.title_th)) {
      cb('กรุณากรอก title');

    } else if (this.api.isEmpty(this.tags)) {
      cb('กรุณาใส่ tags');

    } else if (this.api.isEmpty(this.content_th)) {
      cb('กรุณาใส่ content');

    } else if (this.api.isEmpty(this.dataCover.image)) {
      cb('กรุณาใส่ cover');

    } else {
      cb(true);
    }
  }

  clear() {
    setTimeout(() => {
      this.response = null;
    }, 1000);
  }

}
