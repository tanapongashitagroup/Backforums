import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
  permissionCheck = {
    permission: '',
    mainId:'',
    read: false,
    create: false,
    edit: false,
    delete: false,
  }

  constructor(public app:AppService) { }
  listPermission = [];
  listMain = [];
  selectedValue
  select:number
  
  ngOnInit() {
    this.app.get('/permission/main').subscribe((data:any) => {
      this.listMain = data;
      this.selectedValue = this.listMain[0]._id;
      this.permissionCheck.mainId = this.listMain[0]._id;
      
      this.app.get('/permission').subscribe((data:any) => {
        this.listPermission = data;
        this.findAccess(this.listMain[0]._id)
        
      })
    })
    
  }
  findAccess(mainId){
    this.app.get('/permission/access/'+mainId).subscribe((data:any) => {
      
       this.listPermission.forEach(lp => {
         var access = data.filter(d => d.mainId == mainId && d.permissionId == lp._id)[0];
         if(access){
           lp.access = access;
         }else{
          lp.access = {
            read:false,
            create: false,
            edit: false,
            delete: false,
          };
         }
        
       })
       console.log(this.listPermission);
     })
  }
  selectPermission(i){
    this.select = i;
    //if(this.listPermission.access)
  }
  forceLogout(permissionId){
    this.app.post('/permission/forceLogout?accessToken='+this.app.getToken(),{permissionId:permissionId}).subscribe(data => {
      console.log(data);
    })
  }
  
  onchange(){
    this.findAccess(this.selectedValue)
    // this.app.get('/permission/access/'+this.selectedValue).subscribe((data:any) => {
    //   this.listPermission = data;
    // })
  }
  changePermission(key){
    switch (key) {
      case 'create':
        this.listPermission[this.select].access.create = !this.listPermission[this.select].access.create
        // this.permissionCheck.create = !this.permissionCheck.create;
        break;
        case 'read':
        this.listPermission[this.select].access.read = !this.listPermission[this.select].access.read
        // this.permissionCheck.read = !this.permissionCheck.read;
        break;
        case 'edit':
        this.listPermission[this.select].access.edit = !this.listPermission[this.select].access.edit
        // this.permissionCheck.edit = !this.permissionCheck.edit;
        break;
        case 'delete':
        this.listPermission[this.select].access.delete = !this.listPermission[this.select].access.delete
        // this.permissionCheck.delete = ! this.permissionCheck.delete;
        break;
      default:
        break;
    }
  }
  save(){
    this.permissionCheck.mainId = this.selectedValue;
    this.app.post('/permission/create?accessToken='+this.app.getToken(),this.permissionCheck).subscribe((data:any) => {
      if(data.status){
        this.listPermission.push(data.data);
      }
    })
  }
  edit(){
    this.listPermission[this.select].access.mainId = this.selectedValue;
    this.listPermission[this.select].access.permissionId = this.listPermission[this.select]._id;
    console.log(this.listPermission[this.select]);
    this.app.post('/permission/access?accessToken='+this.app.getToken(),this.listPermission[this.select]).subscribe((data:any) => {
     if(data.status){
      this.listPermission[this.select].access = data.data;
     }else{
       console.log(data);
     }
    })
    console.log( this.listPermission[this.select]);
    
  }
  remove(i){
    
    this.app.post('/permission/remove?accessToken='+this.app.getToken(),{permissionId:this.listPermission[i]._id}).subscribe((data:any) => {
      this.listPermission.splice(i,1);
    })
  }

}
