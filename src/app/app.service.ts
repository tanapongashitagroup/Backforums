import { AlertsService } from '@jaspero/ng2-alerts';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
@Injectable()
export class AppService {

  // url: string = "http://localhost:1712/api"
  url: string = "http://192.168.1.35:1712/api"
  servImg: string = "http://img.ashita.io";

  constructor(private http: HttpClient, private cookie: CookieService, private _alert: AlertsService) { }

  post(url: string, object) {
    return this.http.post(this.url + url, object).map(m => {
      if (this.checkToken(m)) {
        return m;
      } else {
        return false
      }


    });
  }

  get(url: string) {
    return this.http.get(this.url + url).map(m => {
      if (this.checkToken(m)) {
        return m;
      } else {
        return false
      }
    })
  }

  postImg(url: string, object) {
    return this.http.post(this.servImg + url, object).map(m => {
      if (this.checkToken(m)) {
        return m;
      } else {
        return false
      }
    });
  }

  checkToken(data) {
    if ('name' in data) {
      if (data.name == 'JsonWebTokenError' || data.name == 'TokenExpiredError' || data.name == 'tokenInvalid' || data.name == 'tokenInvali') {
        this._alert.create('error', data.message);
        return false;

      }
    } else {
      return true;
    }
  }

  setClient(clientId) {
    this.cookie.put('clientId', clientId);
  }

  getClient() {
    return this.cookie.get('clientId');
  }

  getToken() {
    return this.cookie.get('atk');
  }

  setToken(token) {
    this.cookie.put('atk', token);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  isEmpty(str: string) {
    return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null || str.length == 0
  }

  urlEncode(string: string) {
    var text = string.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text 

    if (text.length > 4) {
      return text
    } else {
      return text + this.getTime()
    }
  }

  getTime() {
    var d = new Date();
    return Math.floor(d.getTime() / 1000);
  }

  convertTime(date: any) {
    return date * 1000;
  }


}
