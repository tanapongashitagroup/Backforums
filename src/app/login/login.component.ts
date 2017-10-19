import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;
  messageError:string;
  constructor(public app:AppService,private router:Router) { }

  ngOnInit() {
  }
  submit(){
    var clientId = this.app.getClient();
    this.app.post('/auth/login',{email:this.email,password:this.password,clientId:clientId}).subscribe((data:any) => {
      if(data.status){

        this.app.setToken(data.accessToken);
        this.app.setClient(data.session_id);
        this.app.get('?accessToken='+this.app.getToken()).subscribe((user:any) => {
          if(user.role.permission == 'admin' || user.role.permission == 'staff'){
            
            this.router.navigate(['/dashboard']);
            
          }else{
            this.messageError = 'คุณไม่ใช้ admin'
          }
        })
        
      }else{
        this.messageError = data.message
        
      }
      setTimeout(() => {
        this.messageError = '';
      },2000)
    })
   
  }

}
