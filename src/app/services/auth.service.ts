import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
 
  constructor(
    public authGuardService: AuthGuardService
  ) { }

  canActivate(): boolean {
    return this.authGuardService.isAuthenticated();
  }
}
