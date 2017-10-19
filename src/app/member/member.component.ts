import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  constructor(public app:AppService) { }
  listUser = [];
  listPermission = [];
  select:string;
  ngOnInit() {
    this.app.get('/member?accessToken='+this.app.getToken()).subscribe((data:any) => {
      if(data){
        console.log(data);
        this.listUser = data;
        this.getPermission();
      }
     
      //console.log(this.listUser);
    
      
    })
  }
  changePermission(uid,value){
    console.log(value);
    this.app.post('/member/update/permission?accessToken='+this.app.getToken(),{uid:uid,permissionId:value}).subscribe(data => {
      console.log(value);
    })
  }
  getPermission(){
    this.app.get('/permission').subscribe((data:any) => {
      this.listPermission = data;
    })
  }

}
