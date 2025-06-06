import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { eventNames } from 'process';
import { finalize } from 'rxjs';
import { DealerElement } from 'src/app/components/dealer/dealer.component';
import { DealersService } from 'src/app/services/dealers.service';
import { OrderService } from 'src/app/services/order.service';
import { ServicesService } from 'src/app/services/services.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  ordersData: any = [];
  columnsToDisplay: { label: string, key: string }[] = [];
  displayedColumnKeys = {};
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [this.pageSize, 50, 100, 500];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.length };
  formToDisplay: { label: string, key: string }[] = [
    { label: "Order ID", key: "orderID" },
    { label: "Customer ID", key: "customerID" },
    { label: "Dealer Name", key: "vendor" },
    { label: "Services", key: "services" },
    { label: "Status", key: "status" },
    { label: "Created By", key: "createdBy" },
    { label: "Ordered Message", key: "orderHistory.ordered" },
    { label: "Shipped Message", key: "orderHistory.shipped" },
    { label: "In-Transit Message", key: "orderHistory.inTransit" },
    { label: "Delivered Message", key: "orderHistory.delivered" },
  ];
  actions: boolean = false;
  deleteOrderElement: DealerElement | null = null;
  deleteMessage: string = "";
  deleteDialog: boolean = false;

  createOrderForm: boolean = false;
  editOrderForm: boolean = false;
  formMessage: string = '';
  services: any = [];
  dealers: any = [];
  pageServices: any = [{ label: "Register Order", icon: "add", value: "register" }]
  id: number | null = null;
  orderID: number | null = null;

  formCreation: any = [
    {
      label: "Customer ID", key: "customerID", value: '', type: 'auto', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Services", key: "services", value: '', type: 'auto', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Dealers", key: "vendor", value: '', type: 'auto', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Status", key: "status", value: '', type: 'selectSingle', validation: ['required'],
      options: ["ORDERED", "SHIPPED", "IN-TRANSIT", "DELIVERED"], disabled: false
    },
    {
      label: "Ordered Message", key: "orderHistory.ordered", value: '', type: 'textarea', validation: [],
      options: [], disabled: false
    },
    {
      label: "Shipped Message", key: "orderHistory.shipped", value: '', type: 'textarea', validation: [],
      options: [], disabled: false
    },
    {
      label: "In-Transit Message", key: "orderHistory.inTransit", value: '', type: 'textarea', validation: [],
      options: [], disabled: false
    },
    {
      label: "Delivered Message", key: "orderHistory.delivered", value: '', type: 'textarea', validation: [],
      options: [], disabled: false
    }
  ];

  newformCreation: any = [
    {
      label: "Customer ID", key: "customerID", value: '', type: 'auto', validation: ['required'],
      options: []
    },
    {
      label: "Services", key: "services", value: '', type: 'auto', validation: ['required'],
      options: []
    },
    {
      label: "Dealers", key: "vendor", value: '', type: 'auto', validation: ['required'],
      options: []
    },
    {
      label: "Status", key: "status", value: '', type: 'selectSingle', validation: ['required'],
      options: ["ORDERED", "SHIPPED", "IN-TRANSIT", "DELIVERED"]
    },
    {
      label: "Ordered Message", key: "orderHistory.ordered", value: '', type: 'textarea', validation: [],
      options: []
    },
    {
      label: "Shipped Message", key: "orderHistory.shipped", value: '', type: 'textarea', validation: [],
      options: []
    },
    {
      label: "In-Transit Message", key: "orderHistory.inTransit", value: '', type: 'textarea', validation: [],
      options: []
    },
    {
      label: "Delivered Message", key: "orderHistory.delivered", value: '', type: 'textarea', validation: [],
      options: []
    }, {
      label: "Upload Docs", key: "files", value: '', type: 'multiFiles', validation: ['required'],
      options: []
    }
  ];

  constructor(private ordersService: OrderService, private toasterService: ToasterService, private breakpointObserver: BreakpointObserver, private servicesService: ServicesService, private dealersService: DealersService, private userService: UserService) {
    this.initializeBreakpointObserver();
  }

  private updateDisplayedColumnKeys() {
    this.displayedColumnKeys = this.columnsToDisplay.map(col => col.key);
  }

  updateOptionsByKey(formCreation: { label: string, key: string, value: string, type: string, validation: string[], options: string[] }[], key: string, newOptions: string[]): { label: string, key: string, value: string, type: string, validation: string[], options: string[] }[] {
    const field = formCreation.find(item => item.key === key);
    if (field) {
      field.options = newOptions;
    } else {
      console.warn(`Field with key "${key}" not found.`);
    }
    return formCreation;
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.initializeBreakpointObserver();
  }

  initializeBreakpointObserver() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Order ID', key: 'orderID' }
        ];
        this.actions = true;
      } else if (result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Small]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Order ID', key: 'orderID' },
          { label: 'Customer ID', key: 'customerID' },
          { label: 'Status', key: 'status' },
          { label: 'Actions', key: 'actions' }
        ];
        this.actions = false;
      } else if (result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Order ID', key: 'orderID' },
          { label: 'CustomerID', key: 'customerID' },
          { label: 'Dealer Name', key: 'vendor' },
          { label: 'Status', key: 'status' },
          { label: 'Actions', key: 'actions' }
        ];
        this.actions = false;
      }
      this.updateDisplayedColumnKeys();
    });
  }

  ngOnInit(): void {
    this.getServices();
    this.getDealers();
    this.getCustomerIDs();
    this.getOrders();
  }

  ngAfterViewInit(): void {
    this.initializeBreakpointObserver();
  }

  refresh(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.getOrders();
  }

  getServices() {
    this.servicesService.getServices().subscribe((data: any) => {
      for (let d of data) {
        this.services.push(d.label.trim());
      }
      this.updateOptionsByKey(this.formCreation, "services", this.services);
      this.updateOptionsByKey(this.newformCreation, "services", this.services);
      this.toasterService.success("Services Fetched SuccessFully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    })
  }

  getDealers() {
    this.dealersService.getDealersCompanyName().subscribe((data: any) => {
      this.updateOptionsByKey(this.formCreation, "vendor", data);
      this.updateOptionsByKey(this.newformCreation, "vendor", data);
      this.toasterService.success("Dealers Fetched SuccessFully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    })
  }

  getCustomerIDs() {
    this.userService.getCustomerIDS().subscribe((data: any) => {
      this.updateOptionsByKey(this.formCreation, "customerID", data);
      this.updateOptionsByKey(this.newformCreation, "customerID", data);
      this.toasterService.success("Dealers Fetched SuccessFully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    })
  }

  getOrders() {
    this.ordersService.getOrderList(this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
      (data: any) => {
        this.ordersData = data.content;
        this.pageEvent = { pageIndex: data.number, pageSize: data.size, length: data.totalElements };
        this.length = data.totalElements;
        this.toasterService.success("Orders Fetched Successfully")
      },
      (error: any) => {
        console.log(error);
        this.toasterService.error(error.message);
      }
    );
  }

  createOrders(element: any, files: any) {
    this.ordersService.createOrder(element, files)
      .pipe(finalize(() => this.getOrders()))
      .subscribe(
        () => {
          this.toasterService.success("Dealer Registered Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  updateOrders(element: any) {
    this.ordersService.updateOrder(element)
      .pipe(finalize(() => this.getOrders()))
      .subscribe(
        () => {
          this.toasterService.success("Dealer Updated Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  deleteOrders() {
    if (this.deleteOrderElement) {
      this.ordersService.deleteOrder(this.deleteOrderElement.id)
        .pipe(finalize(() => this.getOrders()))
        .subscribe(
          () => {
            this.toasterService.success("Dealer Deleted Successfully");
          },
          (error: any) => {
            this.toasterService.error(error.message || "Request failed");
          }
        );
    }
  }

  populateFormCreationValuesFromDealer(dealer: any): void {
    this.formCreation.forEach((field: any) => {
      const key = field.key;
      if (key.startsWith('orderHistory.')) {
        const bankKey = key.split('.')[1];
        field.value = dealer.orderHistory?.[bankKey] ?? '';
      } else {
        field.value = (dealer as any)[key] ?? '';
      }
    });
  }

  editElement(event: any) {
    this.id = event.id;
    this.orderID = event.orderID;
    this.populateFormCreationValuesFromDealer(event);
    this.formMessage = "Editing Order Info";
    this.editOrderForm = true;
  }

  createElement() {
    this.formMessage = "Register Order Info";
    this.createOrderForm = true;
  }

  deleteElement(event: any) {
    console.log(event)
    this.deleteOrderElement = event;
    this.deleteMessage = "Are you sure you want to delete the Order with OrderID: " + event.orderID;
    this.deleteDialog = true;
  }

  cancelProcess(event: any) {
    this.deleteDialog = event;
    this.deleteOrderElement = null;
  }

  deleteProcess(event: any) {
    this.deleteOrders();
    this.deleteDialog = false;
    this.deleteOrderElement = null;
  }

  cancelSubmission(event: any) {
    this.editOrderForm = false;
    this.id = null;
    this.orderID = null;
  }

  submitSubmission(event: any) {
    if (this.statusValidation(event)) {
      event.id = this.id;
      event.orderID = this.orderID;
      this.updateOrders(event);
      this.editOrderForm = false;
      this.id = null;
      this.orderID = null;
    }
  }

  newRegisteration() {
    this.createOrderForm = true;
  }

  cancelRegisteration(event: any) {
    this.createOrderForm = false;
  }

  submitRegisteration(event: any) {
    console.log(event)
    if (this.statusValidation(event)) {
      const files: any = event.files
      delete event.files;
      this.createOrders(event, files);
      this.createOrderForm = false;
    }

  }

  statusValidation(event: any): boolean {
    const requiredStatuses = ["ORDERED", "SHIPPED", "IN-TRANSIT", "DELIVERED"];
    const history = event.orderHistory || {};
    const currentStatus = event.status;

    const index = requiredStatuses.indexOf(currentStatus);
    if (index === -1) return true; // Unknown status, treat as valid

    for (let i = 0; i <= index; i++) {
      const key = this.statusKey(requiredStatuses[i]);
      if (!history[key]) {
        const missing = requiredStatuses.slice(0, i + 1).join(', ');
        this.toasterService.error(`${missing} message${i > 0 ? 's are' : ' is'} required`);
        return false;
      }
    }

    return true;
  }

  private statusKey(status: string): string {
    return status.toLowerCase().replace('-', '');
  }


}
