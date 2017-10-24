import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { AppService } from '../../app.service';
import { CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-categories-cms',
  templateUrl: './categories-cms.component.html',
  styleUrls: ['./categories-cms.component.scss']
})
export class CategoriesCMSComponent implements OnInit {

  listCategories = [];
  _id: any;
  cat_th: string;
  cat_en: string;
  detail_th: string;
  detail_en: string;
  response: string;
  img: string = "http://placehold.it/1920x840";
  imgSave: string;
  color: string = '#005DF9';
  slug: string;
  index: number;

  cropIcon: CropperSettings;
  dataIcon: any;

  constructor(public app: AppService) { }

  ngOnInit() {
    this.cropIcon = new CropperSettings();
    this.cropIcon.width = 1920; // ตัว crop
    this.cropIcon.height = 840;
    this.cropIcon.croppedWidth = 1920;  // ขนาดรูปที่ save ออกมา
    this.cropIcon.croppedHeight = 840;
    this.cropIcon.canvasWidth = 480;  // กล่องตัว upload
    this.cropIcon.canvasHeight = 210;
    this.dataIcon = {};

    this.app.get('/cms/getAllCategories').subscribe(data => {
      this.listCategories = data['Msg'];
    })
  }

  genSlug() {
    if (!this.app.isEmpty(this.cat_th)) {
      this.slug = this.app.urlEncode(this.cat_th)
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size <= 4000000) {
        var reader = new FileReader();

        reader.onload = (event) => {
          this.img = event.target['result'];
          this.imgSave = event.target['result'];
        }

        reader.readAsDataURL(event.target.files[0]);
      } else {
        this.response = 'File is too large Max to 2MB!';
      }
    }
  }

  submit() {
    this.validate(cb => {
      if (cb == true) {
        var save = {
          cat_th: this.cat_th,
          cat_en: (this.cat_en) ? this.cat_en : null,
          detail_th: (this.detail_th) ? this.detail_th : null,
          detail_en: (this.detail_en) ? this.detail_en : null,
          slug: (this.slug) ? this.app.urlEncode(this.slug) : this.app.urlEncode(this.cat_th),
          cover: (this.imgSave) ? this.imgSave : null,
          color: (this.color) ? this.color : '#005DF9',
        }

        this.app.post('/addCategories?accessToken=' + this.app.getToken(), save).subscribe(data => {
          if (data['resCode'] == 1) {
            this.response = 'success'
            this.listCategories.unshift(data['Msg']);
            this.clear();
          } else {
            this.response = data['Msg'];
            setTimeout(() => {
              this.response = null;
            }, 1000);
          }
        })

      } else {
        this.response = cb;
        setTimeout(() => {
          this.response = null;
        }, 1000);
      }
    })
  }

  getCategoriesByID(_id: any, index: number) {
    this.app.post('/getCategoriesByID', { _id: _id }).subscribe(data => {

      var c = data['Msg'];

      this._id = _id;
      this.index = index;
      this.cat_th = c.catName.th;
      this.img = (c.cover) ? this.app.url + c.cover : 'http://placehold.it/1200x900'
      this.color = (c.color) ? c.color : null;
      this.slug = c.slug;

    })
  }

  delCategoriesByID(_id: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {
      this.app.post('/delCategoriesByID?accessToken=' + this.app.getToken(), { _id: _id }).subscribe(data => {
        if (data['resCode'] == 1) {
          this.listCategories.splice(index, 1);
          this.clear();
          swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else {
          swal(
            'Cancelled',
            data['Msg'],
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

  update() {
    this.validate(cb => {
      if (cb == true) {
        var save = {
          _id: this._id,
          cat_th: this.cat_th,
          slug: (this.slug) ? this.app.urlEncode(this.slug) : this.app.urlEncode(this.cat_th),
          cover: (this.imgSave) ? this.imgSave : null,
          color: (this.color) ? this.color : '#005DF9',
        }

        this.app.post('/updateCategories?accessToken=' + this.app.getToken(), save).subscribe(data => {
          if (data['resCode'] == 1) {
            this.response = 'success'
            this.listCategories[this.index].catName.th = this.cat_th;
            this.listCategories[this.index].color = this.color;
            this.listCategories[this.index].slug = this.slug;
            if (this.imgSave) {
              this.listCategories[this.index].cover = data['Msg'];
            }

            this.clear();
          } else {
            this.response = data['Msg'];
            setTimeout(() => {
              this.response = null;
            }, 1000);
          }
        })
      } else {
        this.response = cb;
        setTimeout(() => {
          this.response = null;
        }, 1000);
      }
    })

  }

  validate(cb) {
    if (this.app.isEmpty(this.cat_th)) {
      cb('Catalog name is empty.')
    } else {
      cb(true)
    }
  }

  clear() {
    setTimeout(() => {
      this._id = null;
      this.img = 'http://placehold.it/1920x840';
      this.imgSave = null;
      this.response = null;
      this.slug = null;
      this.cat_th = null;
      this.color = '#005DF9'
      this.index = null;
    }, 1000);
  }

}
