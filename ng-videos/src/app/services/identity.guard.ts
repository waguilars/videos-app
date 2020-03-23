import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class IdentityGuard implements CanActivate {


    constructor(private _router: Router, private _user: UserService) { }

    canActivate() {
        const identity = this._user.getIdentity();
        if (identity) {
            return true;
        } else {
            this._router.navigate(['/inicio']);
            return false;
        }

    }

}
