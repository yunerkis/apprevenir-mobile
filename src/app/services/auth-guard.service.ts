import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject} from 'rxjs'; 
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const TOKEN_KEY = 'active_token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);
  toggle = new BehaviorSubject('login');

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
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
          this.storage.remove('ID');
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
        res['data'].profile.email = credentials['email'];
        res['data'].profile.id = res['data'].id;
        this.storage.set('PROFILE', res['data'].profile); 
        this.user = this.helper.decodeToken(res['data'].access_token);
        this.authenticationState.next(true);
        this.router.navigate(['home']);
      }, error => {
        this.messageErros(error.error.data);
      });
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
          this.storage.remove('PROFILE');
          this.router.navigate(['login']);
        }, error => {
          console.log(error);
        });
    });
  }

  reset(email) {
    return this.http.post(`${this.url}/api/v1/reset-password`, email).subscribe(
      res => {
        this.router.navigate(['login']);
        this.messageSuccess('Email enviado')
      }, error => {
        console.log(error.error.errors);
      });
  }

  register(data) {
    return this.http.post(`${this.url}/api/v1/register`, data).subscribe(
      res => {
        this.router.navigate(['login']);
        this.messageSuccess('Registrado')
      }, data => {
        console.log(data.error.errors);
      });
  }

  updateProfile(data) {
    return this.storage.get('PROFILE').then(profile => {
      return this.storage.get(TOKEN_KEY).then(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
        return this.http.put(`${this.url}/api/v1/users/${profile.id}`, data, {headers: headers}).subscribe(
          res => {
            this.messageSuccess('Perfil actualziado')
            return res;
          }, data => {
            console.log(data.error.errors);
            // this.messageErros(data.error.errors.email[0]);
          });
      });
    });
    
  }

  countries() {
    return this.http.get(`${this.url}/api/v1/countries`).pipe(map(res => {return res;}));
  }

  states(country) {
    return this.http.get(`${this.url}/api/v1/states?country=`+country).pipe(map(res => {return res;}));
  }

  cities(state) {
    return this.http.get(`${this.url}/api/v1/cities?state=`+state).pipe(map(res => {return res;}));
  }

  async messageErros(error) {
    const toast = await this.toastController.create({
      color: 'danger',
      duration: 3000,
      message: error
    });

    await toast.present();
  }

  async messageSuccess(success) {
    const toast = await this.toastController.create({
      color: 'success',
      duration: 3000,
      message: success
    });

    await toast.present();
  }

}
