import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject} from 'rxjs'; 
import { Router } from '@angular/router';

const TOKEN_KEY = 'active_token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);
  toogle = new BehaviorSubject('login');

  constructor(
    private router: Router,
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const decode = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          this.user = decode;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  login(credentials) {
    return this.http.post(`${this.url}/api/v1/login`, credentials).subscribe(
      res => {
        this.storage.set(TOKEN_KEY, res['data'].access_token);
        this.user = this.helper.decodeToken(res['data'].access_token);
        this.authenticationState.next(true);
        this.router.navigate(['test']);
      }, data => {
        console.log(data.error.errors);
        //this.messageErros(data.error.errors.email[0]);
      });
  }

  reset(email) {
    return this.http.post(`${this.url}/api/v1/reset-password`, email).subscribe(
      res => {
        this.toogle.next('login');
      }, error => {
        console.log(error);
      });
  }

  async messageErros(error) {
    const toast = await this.toastController.create({
      color: 'danger',
      duration: 3000,
      message: error
    });

    await toast.present();
  }

  logout() {
    this.storage.get(TOKEN_KEY).then(token => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
      this.http.get(`${this.url}/api/v1/logout`, {headers: headers}).subscribe(
        res => {
          console.log(res);
          this.storage.remove(TOKEN_KEY);
          this.router.navigate(['login']);
        }, error => {
          console.log(error);
        });
    });
  }
}
