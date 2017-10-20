import { AlertsService } from '@jaspero/ng2-alerts';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
@Injectable()
export class AppService {

  url: string = "http://localhost:1712/api"
  urlImg: string = "http://localhost:1712";
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

}
