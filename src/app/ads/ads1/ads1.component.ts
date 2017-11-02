import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import swal from 'sweetalert2';
import { IMyDpOptions } from 'mydatepicker';
declare var $: any;

@Component({
  selector: 'app-ads1',
  templateUrl: './ads1.component.html',
  styleUrls: ['./ads1.component.css']
})
export class Ads1Component implements OnInit {

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('cropper2', undefined) cropper2: ImageCropperComponent;
  cropCover: CropperSettings;
  dataCover: any;

  listAds: any = [];

  name: string;
  link: string;
  click_limit: number;
  date_exp: any;
  date_e: any;
  type: string = 'perclick';

  edit_name: string;
  edit_link: string;
  edit_date_exp: any;
  edit_click_limit: string;
  edit_type: string;

  _id: any;
  response: string;
  img_old: string;
  index: number;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField: false,
  };

  constructor(private app: AppService) { }

  ngOnInit() {
    this.cropCover = new CropperSettings();
    this.cropCover.width = 1000; // ตัว crop
    this.cropCover.height = 188;
    this.cropCover.croppedWidth = 1000;  // ขนาดรูปที่ save ออกมา
    this.cropCover.croppedHeight = 188;
    this.cropCover.dynamicSizing = true;
    this.dataCover = {};

    this.getAllAdvertising();
  }

  selectType(type: string) {
    this.type = type;
    this.edit_type = type;
  }

  addAds() {
    this.validate(cb => {
      if (cb == true) {
        this.app.postImg('/api/updatePicture', { folder: 'advertising', img_old: null, img_new: this.dataCover.image }).subscribe(serv => {
          if (serv['rescode'] == 1) {
            var save = {
              cover: serv['msg'],
              link: this.link,
              name: this.name,
              size: this.cropCover.width + 'x' + this.cropCover.height,
              date_exp: (this.type == 'perclick') ? this.app.getTime() : this.date_exp['epoc'],
              type: this.type,
              click_limit: (this.type == 'perclick') ? this.click_limit : 0,
            }

            this.app.post('/advertising/addAds?accessToken=' + this.app.getToken(), save).subscribe(res => {
              this.response = 'success';

              setTimeout(() => {
                this.name = null;
                this.link = null;
                this.response = null;
                this.click_limit = null;
                this.cropper.reset();

                this.listAds.push(res['data'])
              }, 2000);
            })
          } else {
            console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
          }
        })

      } else {
        this.response = cb;
        setTimeout(() => {
          this.response = null;
        }, 2000);
      }
    })
  }

  getAllAdvertising() {
    this.app.get('/advertising/getAllAdvertising/' + this.cropCover.width + 'x' + this.cropCover.height).subscribe(res => {
      this.listAds = res['data']
    })
  }

  getAdsByID(obj: any, index: number) {
    this._id = obj._id;
    this.index = index;
    this.edit_name = obj.name;
    this.edit_link = obj.link;
    this.edit_click_limit = obj.click_limit;
    this.img_old = obj.cover;
    this.edit_type = obj.type;
    this.date_e = obj.date_exp;
    this.edit_date_exp = { date: { year: this.app.getYMDByTimeStamp(obj.date_exp, 'y'), month: this.app.getYMDByTimeStamp(obj.date_exp, 'm'), day: this.app.getYMDByTimeStamp(obj.date_exp, 'd') } };
  }

  updateAdvertisingByID() {
    if (this.dataCover.image) {
      this.app.postImg('/api/updatePicture', { folder: 'advertising', img_old: this.img_old, img_new: this.dataCover.image }).subscribe(serv => {
        if (serv['rescode'] == 1) {

          var upd = {
            _id: this._id,
            name: this.edit_name,
            link: this.edit_link,
            click_limit: this.edit_click_limit,
            type: this.edit_type,
            date_exp: (this.edit_date_exp['epoc']) ? this.edit_date_exp['epoc'] : this.date_e,
            cover: serv['msg'],
          }

          this.app.post('/advertising/updateAdvertisingByID?accessToken=' + this.app.getToken(), upd).subscribe(res => {
            this.listAds[this.index] = res['data'];
            this.edit_name = null;
            this.edit_link = null;
            this.response = null;
            this.edit_click_limit = null;
            this.edit_date_exp = null;
            this.cropper2.reset();
            $('.modalCover').modal('toggle');
          })
        } else {
          console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
        }
      })
    } else {

      var upd = {
        _id: this._id,
        name: this.edit_name,
        link: this.edit_link,
        click_limit: this.edit_click_limit,
        type: this.edit_type,
        date_exp: (this.edit_date_exp['epoc']) ? this.edit_date_exp['epoc'] : this.date_e,
      }

      this.app.post('/advertising/updateAdvertisingByID?accessToken=' + this.app.getToken(), upd).subscribe(res => {
        this.listAds[this.index] = res['data'];
        $('.modalCover').modal('toggle');
      })
    }
  }

  deleteAdvertising(obj: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {


      this.app.post('/advertising/deleteAdvertising?accessToken=' + this.app.getToken(), { _id: obj._id }).subscribe((data) => {
        if (obj.cover) {
          this.app.postImg('/api/removePicture', { img_old: obj.cover }).subscribe()
        }

        this.listAds.splice(index, 1)

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

  updateActive(_id, index, act) {
    this.app.post('/advertising/updateActive?accessToken=' + this.app.getToken(), { _id: _id, active: act }).subscribe(res => {
      this.listAds[index] = res['data'];
    })
  }

  validate(cb) {
    if (!this.dataCover.image) {
      cb('กรุณาอัพโหลดรูปภาพ')
    } else if (!this.name) {
      cb('กรุณาใส่ชื่อโฆษณา')
    } else if (!this.link) {
      cb('กรุณาใส่ลิ้งค์เว็บไซต์')
    } else {
      cb(true)
    }
  }

}
