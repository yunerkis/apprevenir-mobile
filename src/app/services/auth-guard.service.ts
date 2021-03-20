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
    return this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          this.authenticationState.next(true);
          return true;
        } else {
          this.storage.remove(TOKEN_KEY);
          this.storage.remove('PROFILE');
          return false;
        }
      }
      return false;
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  login(credentials) {
    return this.http.post(`${this.url}/api/v1/login`, credentials).subscribe(
      res => {
        res['data'].profile.email = credentials['email'];
        res['data'].profile.id = res['data'].id;
        this.storage.set(TOKEN_KEY, res['data'].access_token);
        this.storage.set('PROFILE', res['data'].profile); 
        this.user = this.helper.decodeToken(res['data'].access_token);
        this.authenticationState.next(true);
        this.router.navigate(['home']);
      }, error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";
        this.messageErros(errorMessage);
      });
  }

  logout() {
    this.storage.get(TOKEN_KEY).then(token => {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
      this.http.get(`${this.url}/api/v1/logout`, {headers: headers});
    });
    this.userDelete();
  }

  reset(email) {
    return this.http.post(`${this.url}/api/v1/reset-password`, email).subscribe(
      res => {
        this.router.navigate(['login']);
        this.messageSuccess('Email enviado')
      }, error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";
        this.messageErros(errorMessage);
      });
  }

  register(data) {
    return this.http.post(`${this.url}/api/v1/register`, data).subscribe(
      res => {
        this.router.navigate(['login']);
        this.messageSuccess('Usuario registrado correctamente')
      }, error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";
        this.messageErros(errorMessage);
      });
  }

  updateProfile(data) {
    return this.storage.get('PROFILE').then(profile => {
      return this.storage.get(TOKEN_KEY).then(token => {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': '*'
        })
        return this.http.put(`${this.url}/api/v1/users/${profile.id}`, data, {headers: headers}).subscribe(
          res => {
            data.id = profile.id;
            this.storage.remove('PROFILE');
            this.storage.set('PROFILE', data);
            this.messageSuccess('Perfil actualizado')
            return data;
          }, error => {
            const errorMessage = 
              error.error?.data || 
              "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";
            this.messageErros(errorMessage);
          });
      });
    });
  }

  getClientsList(clientType)
  {
    return this.http.get(`${this.url}/api/v1/clients?client=${clientType}`);
  }

  countries() {
    return this.http.get(`${this.url}/api/v1/countries`);
  }

  states(country) {
    return this.http.get(`${this.url}/api/v1/states?country=`+country);
  }

  cities(state) {
    return this.http.get(`${this.url}/api/v1/cities?state=`+state);
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

  userDelete()
  {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove('PROFILE');
    this.router.navigate(['login']);
  }

}
