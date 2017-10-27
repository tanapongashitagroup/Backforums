import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import swal from 'sweetalert2'
import { FormControl } from "@angular/forms";
import { AppService } from '../../app.service';

@Component({
  selector: 'app-postlist-cms',
  templateUrl: './postlist-cms.component.html',
  styleUrls: ['./postlist-cms.component.scss']
})
export class PostlistCMSComponent implements OnInit {

  listPost: any = [];
  listDefault: any = [];
  txtSearch = new FormControl();

  constructor(public app: AppService) { }

  ngOnInit() {
    this.getAllPost();
    this.search();
  }

  getAllPost() {
    this.app.get('/cms/getAllPost').subscribe(data => {
      this.listPost = data['msg'];
      this.listDefault = data['msg'];

      console.log(this.listPost)
    })
  }

  publicPost(_id: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You want to be public post ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I want!',
      cancelButtonText: 'No, keep it'
    }).then(() => {
      this.app.post('/cms/publicPost?accessToken=' + this.app.getToken(), { _id: _id }).subscribe(data => {
        this.listPost[index].status = 'public';
        this.listPost[index].date = this.app.getTime();
        swal(
          'Success!',
          'Your show public.',
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

  delinfo(obj: any, index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this information!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(() => {

      this.app.post('/cms/deletePost?accessToken=' + this.app.getToken(), { _id: obj._id }).subscribe(data => {

        this.app.postImg('/api/removePicture', { img_old: obj.cover }).subscribe()

        this.listPost.splice(index, 1)
        swal(
          'Deleted!',
          'This information has been deleted.',
          'success'
        )
      })

    }, (dismiss) => {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
        swal(
          'Cancelled',
          'This information is safe :)',
          'error'
        )
      }
    })
  }

  search() {
    this.txtSearch.valueChanges.debounceTime(1000).subscribe(newValue => {
      if (newValue && newValue.length >= 3) {
        this.app.get('/cms/search/' + newValue).subscribe(res => {
          this.listPost = res;
        })
      } else {
        this.listPost = this.listDefault;
      }
    });
  }

}
