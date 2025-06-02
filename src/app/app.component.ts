import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  superAdminAccess: any = ["userPage", "dealerPage", "servicePage", "login"];
  adminAccess: any = ["customerPage", "ordersPage", "userPage", "login"];
  userAccess: any = ["customerPage", "ordersPage", "login"]
  CustomerAccess: any = ["packageTrackingPage", "login"]
  pageServices: any = [{ label: "Customers", icon: "add", value: "customerPage", visible: false }, { label: "Orders", icon: "add", value: "ordersPage", visible: false }, { label: "Users", icon: "add", value: "userPage", visible: false }, { label: "Dealers", icon: "add", value: "dealerPage", visible: false }, { label: "Services", icon: "add", value: "servicePage", visible: false }, { label: "Log Out", icon: "add", value: "login", visible: true }]

  token: boolean = false;
  isReload: boolean = false;

  constructor(private router: Router, private storageService: StorageService, private authService: AuthService) {

  }

  updateVisibleServices(services: any[], accessList: string[]) {
    return services.map(service => ({
      ...service,
      visible: accessList.includes(service.value)
    }));
  }

  ngOnInit(): void {
    this.setConfiguration();
    this.storageService.storageChanged$.subscribe(change => {
      this.setConfiguration();
    });
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
      this.isReload = true;
    }
  }

  setConfiguration() {
    if (!this.storageService.getItem('token')) {
      this.router.navigate(['/login']);
      this.token = false;
    } else {
      this.token = true;
      const decode = this.storageService.extractToken();
      if (decode.includes("SUPERADMIN")) {
        this.pageServices = this.updateVisibleServices(this.pageServices, this.superAdminAccess)
      } else if (decode.includes("ADMIN")) {
        this.pageServices = this.updateVisibleServices(this.pageServices, this.adminAccess)
      } else if (decode.includes("USER")) {
        this.pageServices = this.updateVisibleServices(this.pageServices, this.userAccess)
      } else if (decode.includes("CUSTOMER")) {
        this.pageServices = this.updateVisibleServices(this.pageServices, this.CustomerAccess)
      }
    }
  }

  menuService(value: any) {
    if (value == "login") {
      this.storageService.removeItem('token');
    }
    this.router.navigate([value]);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.isReload) {
      this.authService.logout();
    }
  }

}
