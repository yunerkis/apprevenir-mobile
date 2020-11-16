import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
 
  constructor(
    public authGuardService: AuthGuardService,
    private router : Router,
  ) { }

  canActivate(): boolean {
    if (this.authGuardService.isAuthenticated()) {

      return true;
    } else {
      
      this.router.navigate(['/login']);
      
      return false;
    }
  }
}
