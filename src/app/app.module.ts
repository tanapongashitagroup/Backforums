import { CookieService, CookieModule } from 'ngx-cookie';
import { JasperoSelectModule } from '@jaspero/ng2-select';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxCropperModule } from 'ngx-cropper';
import { JasperoAlertsModule } from '@jaspero/ng2-alerts';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TagInputModule } from 'ngx-chips';

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


import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PermissionComponent } from './permission/permission.component';
import { TestComponent } from './test/test.component';
import { MemberComponent } from './member/member.component';

import { ReportComponent } from './report/report.component';
import { ReportExampleComponent } from './report-example/report-example.component';
import { ReportViewsComponent } from './report-views/report-views.component';
import { ManageLevelComponent } from './manage-level/manage-level.component';
import { CategoriesCMSComponent } from './cms/categories-cms/categories-cms.component';
import { PostlistCMSComponent } from './cms/postlist-cms/postlist-cms.component';
import { NewpostCMSComponent } from './cms/newpost-cms/newpost-cms.component';
import { EditpostCMSComponent } from './cms/editpost-cms/editpost-cms.component';
import { ConfigPageviewsComponent } from './config-pageviews/config-pageviews.component';


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
      { path: 'report-views/:_id', component: ReportViewsComponent },
      { path: 'report-example', component: ReportExampleComponent },
      { path: 'managelevel', component: ManageLevelComponent },
      { path: 'config-pageviews', component: ConfigPageviewsComponent },

      {
        path: 'managepost',
        children: [
          { path: '', component: PostlistCMSComponent },
          { path: 'newpost', component: NewpostCMSComponent },
          { path: 'editpost/:_id', component: EditpostCMSComponent },
        ]
      },




      { path: ':ref', component: TopiclistComponent },



    ]
  },
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
    ReportComponent,
    ReportExampleComponent,
    ReportViewsComponent,
    ManageLevelComponent,

    PostlistCMSComponent,
    NewpostCMSComponent,
    EditpostCMSComponent,
    ConfigPageviewsComponent
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
    ColorPickerModule,
    JasperoSelectModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    TagInputModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
