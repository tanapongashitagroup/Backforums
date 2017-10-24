import { AppService } from './../app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile, Ng2FileDropFiles } from 'ng2-file-drop';
import { ValidationManager } from "ng2-validation-manager";
import { AlertsService } from '@jaspero/ng2-alerts';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

declare var Cropper: any;
declare var $: any;

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-topiclist',
  templateUrl: './topiclist.component.html',
  styleUrls: ['./topiclist.component.scss']
})
export class TopiclistComponent implements OnInit {

  topic: string;
  description: string;
  color: string = '#005DF9';
  ref: String;
  img_old: string;

  // currentProfileImage: string;
  // imageShown: boolean;
  // imageChangedEvent: any = '';
  // croppedImage: any = '';
  // statusCrop: boolean = false;

  // @ViewChild('img') img: ElementRef;

  dataCover: any;
  cropCover: CropperSettings;
  cover: string;
  response_cov: string;
  status_cov: number;

  dataTopic = [];
  listTopic = [];
  // cropper: any; 

  dataUpdate = { topicId: '', number: 0 }


  formCreate = new ValidationManager({
    'topic': 'required',
    'description': 'required',
    'color': 'required|maxLength:20',
  });

  formUpdate = new ValidationManager({
    'topic': 'required',
    'description': 'required',
    'color': 'required|maxLength:20',
  });

  constructor(public app: AppService, private ar: ActivatedRoute, private alert: AlertsService, private confirmation: ConfirmationService) { }

  ngOnInit() {
    this.cropCover = new CropperSettings();
    this.cropCover.width = 50; // ตัว crop
    this.cropCover.height = 50;
    this.cropCover.croppedWidth = 50;  // ขนาดรูปที่ save ออกมา
    this.cropCover.croppedHeight = 50;
    this.cropCover.canvasWidth = 200;  // กล่องตัว upload
    this.cropCover.canvasHeight = 150;
    this.dataCover = {};

    this.ar.params.subscribe(p => {
      if (p['ref']) {
        this.ref = p['ref'];
        this.app.get('/post/topic/' + this.ref + '?accessToken=' + this.app.getToken()).subscribe((data: any) => {
          if (data['obj']) {
            this.listTopic = data['obj'];
            this.dataTopic = data['topic']
          }
        })
      } else {

        this.app.get('/post/topic?accessToken=' + this.app.getToken()).subscribe((data: any) => {
          if (data) {
            this.listTopic = data;
          }
        })
      }
    })
  }

  save() {
    if (this.formCreate.isValid()) {
      if (this.ref) {
        this.formCreate.getData().ref = this.ref
      }

      if (this.dataCover.image) {
        this.app.postImg('/api/updatePicture', { folder: 'topics', img_old: null, img_new: this.dataCover.image }).subscribe(serv => {
          if (serv['rescode'] == 1) {

            this.formCreate.getData().picture = serv['msg']

            this.cropCover = new CropperSettings();

            this.app.post('/post/createTopic?accessToken=' + this.app.getToken(), this.formCreate.getData()).subscribe((data: any) => {
              if (data.status) {
                this.formCreate.reset();
                $('.modalCreate').modal('toggle');
                this.listTopic.push(data.data)
              }
            })

          } else {
            console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
          }
        })

      } else {
        this.app.post('/post/createTopic?accessToken=' + this.app.getToken(), this.formCreate.getData()).subscribe((data: any) => {
          if (data.status) {
            this.formCreate.reset();
            $('.modalCreate').modal('toggle');
            this.listTopic.push(data.data)
          }
        })
      }

    } else {
      console.log('unsuccess')
    }
  }

  getUpdate(topic, i) {

    this.formUpdate.setValue({
      'topic': topic.topic,
      'description': topic.description,
      'color': topic.color,
    });

    this.dataUpdate.topicId = topic._id;
    this.dataUpdate.number = i;

    this.img_old = (topic.picture) ? topic.picture : null;
    this.dataCover.image = null;
  }

  update() {
    if (this.formUpdate.isValid()) {

      this.formUpdate.getData().topicId = this.dataUpdate.topicId;

      if (this.dataCover.image) {
        this.app.postImg('/api/updatePicture', { folder: 'topics', img_old: this.img_old, img_new: this.dataCover.image }).subscribe(serv => {
          if (serv['rescode'] == 1) {
            this.formUpdate.getData().picture = serv['msg']

            this.app.post('/post/updateTopic?accessToken=' + this.app.getToken(), this.formUpdate.getData()).subscribe((data: any) => {
              if (data.status) {
                this.listTopic[this.dataUpdate.number] = data.data;
                $('.modalUpdate').modal('toggle');
              }
            })
          } else {
            console.log('ไม่สามารถอัพโหลดได้ในขณะนี้ กรุณาลองใหม่ภายหลัง')
          }
        })
      } else {
        this.app.post('/post/updateTopic?accessToken=' + this.app.getToken(), this.formUpdate.getData()).subscribe((data: any) => {
          if (data.status) {
            this.listTopic[this.dataUpdate.number] = data.data;
            $('.modalUpdate').modal('toggle');
          }
        })
      }
    }
  }

  del(topic, i) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {

      this.app.post('/post/delTopic?accessToken=' + this.app.getToken(), { topicId: topic._id }).subscribe((data) => {
        if (data['status']) {

          if (topic.picture) {
            this.app.postImg('/api/removePicture', { img_old: topic.picture }).subscribe()
          }
          this.listTopic.splice(i, 1);

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

  upload(event) {
    // let fileReader = new FileReader();
    // fileReader.onload = () => {
    //   this.currentProfileImage = fileReader.result;
    //   this.imageShown = true;
    // };
    // fileReader.readAsDataURL(event.target.files[0]);
  }

  fileChangeEvent(event: any): void {
    // this.statusCrop = true;
    // this.imageChangedEvent = event;
  }

  imageCropped(image: string) {
    // this.croppedImage = image;
  }


  private dragFileOverStart() {
  }

  // File being dragged has moved out of the drop region
  private dragFileOverEnd() {
  }

  // File being dragged has been dropped and is valid
  private dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
    console.log(acceptedFile)
  }

  // File being dragged has been dropped and has been rejected
  private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log(rejectedFile)
  }
  private dragFilesDropped(droppedFile: Ng2FileDropFiles) {
    console.log(droppedFile)
  }
}

export interface ResolveEmit {

  // Returns this if modal resolved with yes or no
  resolved?: boolean;
  // If the modal was closed in some other way this is removed
  closedWithOutResolving?: string;
}
export interface ConfirmSettings {
  overlay?: boolean; // Default: true
  overlayClickToClose?: boolean; // Default: true
  showCloseButton?: boolean; // Default: true
  confirmText?: string; // Default: 'Yes'
  declineText?: string; // Default: 'No'
}
export interface AlertSettings {
  overlay?: boolean;
  overlayClickToClose?: boolean;
  showCloseButton?: boolean;
  duration?: number;
}

