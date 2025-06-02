import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionExtendComponent } from '../shared/session-extend/session-extend.component';
import { StorageService } from './storage.service';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private refreshInterval: any;
  private popupShown = false;

  constructor(private http: HttpClient, private dialog: MatDialog, private StorageService: StorageService, private router: Router) { }

  startSession(token: string) {
    this.StorageService.setItem('token', token)
    this.scheduleRefresh(25 * 60 * 1000); // 25 minutes
  }

  private scheduleRefresh(ms: number) {
    if (this.refreshInterval) clearTimeout(this.refreshInterval);
    this.refreshInterval = setTimeout(() => this.showExtendPopup(), ms);
  }

  private showExtendPopup() {
    if (this.popupShown) return;
    this.popupShown = true;
    const dialogRef = this.dialog.open(SessionExtendComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      this.popupShown = false;
      if (result === 'extend') {
        this.http.post('http://localhost:8080/api/upayServices/users/refresh', {}).subscribe((res: any) => {
          this.startSession(res.refresh); // Reschedule with new token
        });
      } else {
        this.logout(); // Session expired
      }
    });
  }

  logout() {
    this.StorageService.removeItem('token');
    clearTimeout(this.refreshInterval);
    // redirect to login
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Date.now() > expiry * 1000;
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === role;
  }

  private roleAccess: { [key: string]: string[] } = {
    SUPERADMIN: ["userPage", "dealerPage", "servicePage"],
    ADMIN: ["customerPage", "ordersPage", "userPage"],
    USER: ["customerPage", "ordersPage"],
    CUSTOMER: ["packageTrackingPage"]
  };

  // Simulate retrieving userRole from RoleID (localStorage or JWT)
  private getUserRole(): string {
    const token = this.StorageService.extractToken();
    if (token.includes("SUPERADMIN")) {
      return "SUPERADMIN";
    } else if (token.includes("ADMIN")) {
      return "ADMIN"
    } else if (token.includes("USER")) {
      return "USER"
    } else if (token.includes("CUSTOMER")) {
      return "CUSTOMER"
    }
    return "";
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredPage = route.data['page'] as string;
    const userRole = this.getUserRole();
    const allowedPages = this.roleAccess[userRole] || [];
    console.log(allowedPages)

    if (allowedPages.includes(requiredPage)) {
      return true;
    }

    return this.router.parseUrl('/not-found'); // or redirect to /login
  }
}