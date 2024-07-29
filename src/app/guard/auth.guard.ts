import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  haveloggedin: boolean= false

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const loggedinString = localStorage.getItem('loggedin');
      this.haveloggedin = loggedinString ? JSON.parse(loggedinString) : false;
    }else{
      this.haveloggedin=false
    }

    if (this.haveloggedin) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
