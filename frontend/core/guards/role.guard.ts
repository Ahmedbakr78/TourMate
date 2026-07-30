import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleEnum } from '../models/enums';

/**
 * Usage in routes: { path: 'admin', canActivate: [RoleGuard], data: { roles: [RoleEnum.ADMIN] } }
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles = route.data['roles'] as RoleEnum[] | undefined;

    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/auth/login']);
    }

    if (!allowedRoles?.length) return true;

    if (this.authService.hasRole(...allowedRoles)) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
