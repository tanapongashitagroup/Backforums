import { CookieService, CookieModule } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopiclistComponent } from './topiclist/topiclist.component';
import { CommonModule } from '@angular/common';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxCropperModule } from 'ngx-cropper';
import { JasperoAlertsModule } from '@jaspero/ng2-alerts';
import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PermissionComponent } from './permission/permission.component';
import { TestComponent } from './test/test.component';
import { MemberComponent } from './member/member.component';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { ReportComponent } from './report/report.component';

const Routing = RouterModule.forRoot([
  { path: '', component: LoginComponent },
  { path: 'test', component: TestComponent },
  {
    path: 'dashboard', component: DashboardComponent,

    children: [
      { path: '', component: TopiclistComponent },
      { path: 'member', component: MemberComponent },
      { path: 'permission', component: PermissionComponent },
      { path: 'report', component: ReportComponent },
      { path: ':ref', component: TopiclistComponent },

    ]
  }
])

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    DashboardComponent,
    TopiclistComponent,
    PermissionComponent,
    TestComponent,
    MemberComponent,
    ImageCropperComponent,
    ReportComponent
  ],
  imports: [
    BrowserAnimationsModule,
    JasperoConfirmationsModule,
    JasperoAlertsModule,
    ReactiveFormsModule,
    NgxCropperModule,
    ImageCropperModule,
    Ng2FileDropModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    Routing,
    CookieModule.forRoot(),
    BrowserModule,
    ColorPickerModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
