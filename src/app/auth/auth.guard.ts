import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';// assuming you have an AuthService that manages user login status
import { MyserviceService } from '../myservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: MyserviceService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
     
      // console.log("authorized")
      return true; // Allow navigation if authenticated
    } else {
      console.warn('Unauthorized access attempt detected. Redirecting to login.');
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false; // Block navigation
    }
  }
}
