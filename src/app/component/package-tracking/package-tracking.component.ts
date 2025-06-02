import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css']
})
export class PackageTrackingComponent implements OnInit {

  constructor(private orderService: OrderService, private toasterService: ToasterService) { }

  packageStatus = [
    { label: 'Order Placed', value: "ORDERED", key: 'ordered', icon: 'shopping_cart', completed: false },
    { label: 'Shipped', value: "SHIPPED", key: 'shipped', icon: 'local_shipping', completed: false },
    { label: 'Out for Delivery', value: "INTRANSIT", key: 'inTransit', icon: 'directions_bike', completed: false },
    { label: 'Delivered', value: "DELIVERED", key: 'delivered', icon: 'home', completed: false },
  ];

  orders: any = []
  ngOnInit(): void {
    this.orderService.getPackages().subscribe((data: any) => {
      for (let d of data) {
        d.packageStatus = this.updatePackageStatus(d.status, this.packageStatus)
      }
      this.orders = data;

      this.toasterService.success("Orders Fetched Successfully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    })
  }

  getPackageStatus(packageStatus: any) {
    return packageStatus.findIndex((s: any) => !s.completed);
  }

  getValue(packageStatus: any) {
    return (packageStatus.filter((s: any) => s.completed).length / this.packageStatus.length) * 100;
  }

  updatePackageStatus(status: string, packageStatus: any): any {
    const index = packageStatus.findIndex((s: any) => s.value === status);

    if (index !== -1) {
      packageStatus = packageStatus.map((item: any, i: any) => ({
        ...item,
        completed: i <= index
      }));
    }
    return packageStatus
  }

}
