import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { CropperSettings } from 'ng2-img-cropper';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-manage-level',
  templateUrl: './manage-level.component.html',
  styleUrls: ['./manage-level.component.css']
})
export class ManageLevelComponent implements OnInit {

  cropIcon: CropperSettings;
  dataIcon: any;

  _id: any;
  name: string;
  response: string;
  listIcon = [];
  img_old: string;
  edit_name: string;
  index: number;

  constructor(private app: AppService) { }

  ngOnInit() {
    this.cropIcon = new CropperSettings();
    this.cropIcon.width = 50; // ตัว crop
    this.cropIcon.height = 50;
    this.cropIcon.croppedWidth = 50;  // ขนาดรูปที่ save ออกมา
    this.cropIcon.croppedHeight = 50;
    this.cropIcon.canvasWidth = 200;  // กล่องตัว upload
    this.cropIcon.canvasHeight = 150;
    this.dataIcon = {};

    this.getAllIcon();
  }

  addLevel() {
    this.validate(cb => {
      if (cb == true) {
        this.app.postImg('/api/updatePicture', { folder: 'levels', img_old: null, img_new: this.dataIcon.image }).subscribe(serv => {
          if (serv['rescode'] == 1) {
            var save = {
              name: this.name,
              icon: serv['msg']
            }

            this.app.post('/level/addLevel?accessToken=' + this.app.getToken(), save).subscribe(data => {
              this.response = 'success';

              setTimeout(() => {
                this.name = null;
                this.response = null;
                this.listIcon.push(data['msg'])
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

  getAllIcon() {
    this.app.get('/level/getAllIcon').subscribe(data => {
      this.listIcon = data['msg']
    })
  }

  getIconByID(obj: any, index: number) {
    this._id = obj._id;
    this.index = index;
    this.edit_name = obj.name;
    this.img_old = obj.icon
  }

  updateIconByID() {
    if (this.dataIcon.image) {
      this.app.postImg('/api/updatePicture', { folder: 'levels', img_old: this.img_old, img_new: this.dataIcon.image }).subscribe(serv => {
        if (serv['rescode'] == 1) {
          this.app.post('/level/updateIconByID?accessToken=' + this.app.getToken(), { _id: this._id, name: this.edit_name, icon: serv['msg'] }).subscribe(data => {
            this.listIcon[this.index] = data['msg'];
            $('.modalIcon').modal('toggle');
          })
        } else {
          console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
        }
      })
    } else {
      this.app.post('/level/updateIconByID?accessToken=' + this.app.getToken(), { _id: this._id, name: this.edit_name }).subscribe(data => {
        this.listIcon[this.index] = data['msg'];
        $('.modalIcon').modal('toggle');
      })
    }
  }

  deleteIcon(obj: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {


      this.app.post('/level/deleteIcon?accessToken=' + this.app.getToken(), { _id: obj._id }).subscribe((data) => {
        if (obj.icon) {
          this.app.postImg('/api/removePicture', { img_old: obj.icon }).subscribe()
        }

        this.listIcon.splice(index, 1)

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
    if (!this.dataIcon.image) {
      cb('กรุณาอัพโหลดไอคอน')
    } else if (!this.name) {
      cb('กรุณาใส่ชื่อเลเวล')
    } else {
      cb(true)
    }
  }

}
