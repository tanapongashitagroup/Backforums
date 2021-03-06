import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from '../../app.service';
import { CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-editpost-cms',
  templateUrl: './editpost-cms.component.html',
  styleUrls: ['./editpost-cms.component.scss']
})
export class EditpostCMSComponent implements OnInit {

  response: string;
  tags: any = [];
  title_th: string;
  content_th: string;
  slug: string;
  _id: any;
  img_old: string;

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

  constructor(public api: AppService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.cropCover = new CropperSettings();
    this.cropCover.width = 1000; // ตัว crop
    this.cropCover.height = 600;
    this.cropCover.croppedWidth = 1000;  // ขนาดรูปที่ save ออกมา
    this.cropCover.croppedHeight = 600;
    this.cropCover.canvasWidth = 500;  // กล่องตัว upload
    this.cropCover.canvasHeight = 300;
    this.dataCover = {};

    this.route.params.subscribe(res => {
      this._id = res['_id'];
      this.getPostByID();
    })
  }

  getPostByID() {
    this.api.get('/cms/getPostByID/' + this._id).subscribe(data => {
      var res = data['msg'];
      if (res) {
        this._id = res._id;
        this.title_th = res.title.th
        this.slug = res.slug
        this.content_th = res.content.th
        this.tags = res.tags
        this.img_old = res.cover;
      } else {
        this.router.navigate(['/dashboard/managepost'])
      }
    })
  }

  genSlug() {
    if (!this.api.isEmpty(this.title_th)) {
      this.slug = this.api.urlEncode(this.title_th)
    }
  }

  submit() {

    this.checkInput(check => {
      if (check == true) {

        if (this.dataCover.image) {
          this.api.postImg('/api/updatePicture', { folder: 'posts', img_old: this.img_old, img_new: this.dataCover.image }).subscribe(serv => {
            if (serv['rescode']) {
              var save = {
                _id: this._id,
                title_th: this.title_th,
                slug: (this.slug) ? this.api.urlEncode(this.slug) : this.api.urlEncode(this.title_th),
                tags: this.tags,
                content_th: this.content_th,
                cover: serv['msg'],
              }

              this.api.post('/cms/updatePost?accessToken=' + this.api.getToken(), save).subscribe(data => {
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
          var save = {
            _id: this._id,
            title_th: this.title_th,
            slug: (this.slug) ? this.api.urlEncode(this.slug) : this.api.urlEncode(this.title_th),
            tags: this.tags,
            content_th: this.content_th,
          }

          this.api.post('/cms/updatePost?accessToken=' + this.api.getToken(), save).subscribe(data => {
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
        }

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
