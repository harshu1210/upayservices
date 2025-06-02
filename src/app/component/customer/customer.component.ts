import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  userData: any = [];
  columnsToDisplay: { label: string, key: string }[] = [];
  displayedColumnKeys = {};
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [this.pageSize, 50, 100, 500];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.length };
  formToDisplay: { label: string, key: string }[] = [
    { label: "Full Name", key: "fullName" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Email", key: "email" },
    { label: "User Name", key: "username" },
    { label: "Role", key: "role" },
    { label: "Customer ID", key: "customerID" }
  ];
  actions: boolean = false;
  deleteUserElement: UserElement | null = null;
  deleteMessage: string = "";
  deleteDialog: boolean = false;

  createUserForm: boolean = false;
  editUserForm: boolean = false;
  formMessage: string = '';
  pageServices: any = [{ label: "Register Customer", icon: "add", value: "register" }]

  formCreation: any = [
    {
      label: "Full Name", key: "fullName", value: '', type: 'text', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Email", key: "email", value: '', type: 'email', validation: ['required', 'email'],
      options: [], disabled: true
    },
    {
      label: "User Name", key: "username", value: '', type: 'text', validation: ['required', 'noSpaces', 'noCaps'],
      options: [], disabled: true
    },
    {
      label: "Role", key: "role", value: 'CUSTOMER', type: 'text', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Phone Number", key: "phoneNumber", value: '', type: 'text', validation: ['required', 'phoneNumber'],
      options: [], disabled: true
    }
  ];

  newformCreation: any = [
    {
      label: "Full Name", key: "fullName", value: '', type: 'text', validation: ['required'],
      options: [], disabled: false
    },
    {
      label: "Email", key: "email", value: '', type: 'email', validation: ['required', 'email'],
      options: [], disabled: false
    },
    {
      label: "User Name", key: "username", value: '', type: 'text', validation: ['required', 'noSpaces', 'noCaps'],
      options: [], disabled: false
    },
    {
      label: "Role", key: "role", value: 'CUSTOMER', type: 'text', validation: ['required'],
      options: [], disabled: true
    },
    {
      label: "Phone Number", key: "phoneNumber", value: '', type: 'text', validation: ['required', 'phoneNumber'],
      options: [], disabled: false
    }
  ];

  constructor(private userService: UserService, private toasterService: ToasterService, private breakpointObserver: BreakpointObserver) {
    this.initializeBreakpointObserver();
  }

  private updateDisplayedColumnKeys() {
    this.displayedColumnKeys = this.columnsToDisplay.map(col => col.key);
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
          { label: 'Customer ID', key: 'customerID' }
        ];
        this.actions = true;
      } else if (result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge] || result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Small]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Customer ID', key: 'customerID' },
          { label: 'User Name', key: 'username' },
          { label: 'Email', key: 'email' },
          { label: 'Role', key: 'role' },
          { label: 'Actions', key: 'actions' }
        ];
        this.actions = false;
      }
      this.updateDisplayedColumnKeys();
    });
  }

  ngOnInit(): void {
    this.getCustomer();
  }

  ngAfterViewInit(): void {
    this.initializeBreakpointObserver();
  }

  refresh(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.getCustomer();
  }


  getCustomer() {
    this.userService.getCustomerList(this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
      (data: any) => {
        this.userData = data.content;
        this.pageEvent = { pageIndex: data.number, pageSize: data.size, length: data.totalElements };
        this.length = data.totalElements;
        this.toasterService.success("Customer Fetched Successfully")
      },
      (error: any) => {
        console.log(error);
        this.toasterService.error(error.message);
      }
    );
  }

  createUsers(element: any) {
    this.userService.createUser(element)
      .pipe(finalize(() => this.getCustomer()))
      .subscribe(
        () => {
          this.toasterService.success("Customer Registered Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  updateCustomers(element: any) {
    this.userService.updateUser(element)
      .pipe(finalize(() => this.getCustomer()))
      .subscribe(
        () => {
          this.toasterService.success("Customer Updated Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  deleteCustomers() {
    if (this.deleteUserElement) {
      this.userService.deleteUser(this.deleteUserElement.id)
        .pipe(finalize(() => this.getCustomer()))
        .subscribe(
          () => {
            this.toasterService.success("Customer Deleted Successfully");
          },
          (error: any) => {
            this.toasterService.error(error.message || "Request failed");
          }
        );
    }
  }

  populateFormCreationValuesFromUser(user: any): void {
    this.formCreation.forEach((field: any) => {
      const key = field.key;
      field.value = (user as any)[key] ?? '';
    });
  }

  editElement(event: any) {
    event.active = event.active ? 'Yes' : 'No';
    this.populateFormCreationValuesFromUser(event);
    this.formMessage = "Editing Customer Info";
    this.editUserForm = true;
  }

  createElement() {
    this.formMessage = "Register Customer Info";
    this.createUserForm = true;
  }

  deleteElement(event: any) {
    this.deleteUserElement = event;
    this.deleteMessage = "Are you sure you want to delete the Customer with User Name: " + event.userName;
    this.deleteDialog = true;
  }

  cancelProcess(event: any) {
    this.deleteDialog = event;
    this.deleteUserElement = null;
  }

  deleteProcess(event: any) {
    this.deleteCustomers();
    this.deleteDialog = false;
    this.deleteUserElement = null;
  }

  cancelSubmission(event: any) {
    this.editUserForm = false;
  }

  submitSubmission(event: any) {
    event.active = true
    event.role = "CUSTOMER";
    this.updateCustomers(event);
    this.editUserForm = false;
  }

  newRegisteration() {
    this.createUserForm = true;
  }

  cancelRegisteration(event: any) {
    this.createUserForm = false;
  }

  submitRegisteration(event: any) {
    event.active = true;
    event.role = "CUSTOMER";
    this.createUsers(event);
    this.createUserForm = false;
  }

}

export interface UserElement {
  id: number,
  username: string,
  fullName: string,
  email: string,
  role: string,
  active: boolean,
  phoneNumber: string
}