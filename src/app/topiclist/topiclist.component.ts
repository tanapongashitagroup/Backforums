import { AppService } from './../app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile, Ng2FileDropFiles } from 'ng2-file-drop';
import {ValidationManager} from "ng2-validation-manager";
import { AlertsService } from '@jaspero/ng2-alerts';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import {ActivatedRoute} from '@angular/router';
declare var Cropper: any;
declare var $:any; 
@Component({
  selector: 'app-topiclist',
  templateUrl: './topiclist.component.html',
  styleUrls: ['./topiclist.component.css']
})
export class TopiclistComponent implements OnInit {
  currentProfileImage:string;
  imageShown:boolean;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  statusCrop:boolean = false;
  @ViewChild('img') img : ElementRef;
  constructor(public app:AppService,private ar:ActivatedRoute,private alert: AlertsService,private confirmation: ConfirmationService) { }
 
  listTopic = [];
  cropper:any;
  formCreate = new ValidationManager({
    'topic'        : 'required|maxLength:20',
   
    'description' : 'required|maxLength:50',
   
  });
  formUpdate = new ValidationManager({
    'topic'        : 'required|maxLength:20',
   
    'description' : 'required|maxLength:50',
   
  });
  topic:string;
  description:string;
  dataUpdate = {topicId:'',number:0}
  ref:String;
  ngOnInit() {
    this.ar.params.subscribe(p => {
      if(p['ref']){
        this.ref = p['ref'];
        this.app.get('/post/topic/'+this.ref  +'?accessToken='+this.app.getToken()).subscribe((data:any) => {
          
          if(data){
            this.listTopic = data;
           
          }
          
        })
      }else{
        this.app.get('/post/topic?accessToken='+this.app.getToken()).subscribe((data:any) => {
          
          if(data){
            this.listTopic = data;
           
          }
          
        })
      }
    })
    
    
  }
  del(topic,i){
    this.confirmation.create('Confirm','ต้องการลบ '+topic.topic+' ?').subscribe((data:ResolveEmit) => {
      if(data.resolved){
        this.app.post('/post/delTopic?accessToken='+this.app.getToken(),{topicId:topic._id}).subscribe((data) => {
          if(data){
            this.listTopic.splice(i,1);
          }
          
         
        })
      }
      
    })
  }
  upload(event){
    
    let fileReader = new FileReader();
      fileReader.onload = () => {

         
          this.currentProfileImage = fileReader.result;
          this.imageShown = true;
          
          console.log(this.currentProfileImage)
      };
      

    
      
      fileReader.readAsDataURL(event.target.files[0]);
  }
  fileChangeEvent(event: any): void {
    this.statusCrop = true;
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent);
    
}
imageCropped(image: string) {
    this.croppedImage = image;
   
}
getUpdate(topic,i){
 
  this.formUpdate.setValue({
    'topic': topic.topic,
    'description':topic.description
  });
  this.dataUpdate.topicId = topic._id;
  this.dataUpdate.number = i;
  
  if(topic.picture){
    this.croppedImage = this.app.urlImg+topic.picture;
  }
  
  
}

  save(){
    
    
    if(this.formCreate.isValid()){
      if(this.croppedImage){
        this.formCreate.getData().picture = this.croppedImage;
      }
      if(this.ref){
        this.formCreate.getData().ref = this.ref
      }
      
      this.app.post('/post/createTopic?accessToken='+this.app.getToken(),this.formCreate.getData()).subscribe((data:any) => {
        if(data.status){
          this.formCreate.reset();
          this.croppedImage = '';
          this.statusCrop = false;
          $('.modalCreate').modal('toggle');
          this.listTopic.push(data.data)
          
        }
      })
    }else{
      console.log('unsuccess')
    }
    
  }
  update(){
    if(this.formUpdate.isValid()){
      if(this.croppedImage && this.statusCrop){
        
        this.formUpdate.getData().picture = this.croppedImage;
      }
      this.formUpdate.getData().topicId = this.dataUpdate.topicId;
      
      this.app.post('/post/updateTopic?accessToken='+this.app.getToken(),this.formUpdate.getData()).subscribe((data:any) => {
        if(data.status){
          this.listTopic[this.dataUpdate.number] = data.data;
          this.croppedImage = ''
          $('.modalUpdate').modal('toggle');
          this.statusCrop = false
        }
      })
    }
   
  }
  private dragFileOverStart() {
    console.log('xx')
  }
 
  // File being dragged has moved out of the drop region
  private dragFileOverEnd() {
    console.log('xx222')
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

