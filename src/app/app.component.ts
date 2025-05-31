import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  
  superAdminAccess: any = ["customerPage", "ordersPage", "userPage", "dealerPage", "servicePage"];
  adminAccess: any = ["customerPage", "ordersPage", "userPage"];
  userAccess: any = ["customerPage", "ordersPage"]
  pageServices: any = [{ label: "Customers", icon: "add", value: "customerPage", visible: false }, { label: "Orders", icon: "add", value: "ordersPage", visible: false }, { label: "Users", icon: "add", value: "userPage", visible: false }, { label: "Dealers", icon: "add", value: "dealerPage",visible: false }, { label: "Services", icon: "add", value: "servicePage",visible: false }]

  token:boolean = false;

  constructor(private router:Router, private storageService:StorageService){

  }

  updateVisibleServices(services: any[], accessList: string[]) {
    return services.map(service => ({
      ...service,
      visible: accessList.includes(service.value)
    }));
  }

  ngOnInit(): void {
    this.storageService.storageChanged$.subscribe(change => {
     if(!this.storageService.getItem('token')){
      this.router.navigate(['/login']);
      this.token = false;
     }else{
      this.token = true;
      const decode = this.storageService.extractToken();
      if(decode.contains("SUPERADMIN")){
        this.pageServices = this.updateVisibleServices(this.pageServices,this.superAdminAccess)
      }else if(decode.contains("ADMIN")){
        this.pageServices = this.updateVisibleServices(this.pageServices,this.adminAccess)
      }else if(decode.contains("USER")){
        this.pageServices = this.updateVisibleServices(this.pageServices,this.userAccess)
      }
     }
  });
  }

  menuService(value: any) {
    this.router.navigate(["/"+value]);
  }
  
}
