import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject} from 'rxjs'; 
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const TOKEN_KEY = 'active_token';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  url = environment.url;
  test = new BehaviorSubject([]);
  testInfo = new BehaviorSubject([]);

  constructor(
    private router: Router,
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
  ) { }

  getTestsList() {
    return this.storage.get(TOKEN_KEY).then(token => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
      })
      return this.http.get(`${this.url}/api/v1/tests`, {headers: headers});
    });
  }

  getTest(id) {
    return this.storage.get(TOKEN_KEY).then(token => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
      })
      return this.http.get(`${this.url}/api/v1/tests/${id}`, {headers: headers});
    });
  }

  storeAnswer(answer) {
    return this.storage.get(TOKEN_KEY).then(token => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
      })
      return this.http.post(`${this.url}/api/v1/users/answer`, answer, {headers: headers}).subscribe(
        res => {
          this.testInfo.next(res['data']);
          this.router.navigate(['test/test-result']);
        }, data => {
          if (data.error.data == 'disabled') {
            this.userDelete()
          }
          console.log(data.error.errors);
        });
    });
  }

  myResults() {
    return this.storage.get('PROFILE').then(profile => {
      return this.storage.get(TOKEN_KEY).then(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': '*'
        })
        return this.http.get(`${this.url}/api/v1/users/results/${profile.id}`, {headers: headers});
      });
    });
  }

  image(filename)
  {
    return this.http.get(`${this.url}/image/${filename}`);
  }

  userDelete()
  {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove('PROFILE');
    this.router.navigate(['login']);
  }
}
