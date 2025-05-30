import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DealersService } from 'src/app/services/dealers.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit, AfterViewInit {

  dealersData: any = [];
  columnsToDisplay: { label: string, key: string }[] = [];
  displayedColumnKeys = {};
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [this.pageSize, 50, 100, 500];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.length };
  formToDisplay: { label: string, key: string }[] = [
    { label: "Company Name", key: "companyName" },
    { label: "Buisness Email", key: "businessEmail" },
    { label: "Buisness Phone Number", key: "businessPhoneNumber" },
    { label: "Address", key: "address" },
    { label: "Services", key: "services" },
    { label: "GST Number", key: "gstNumber" },
    { label: "Beneficiary Name", key: "bankDetails.beneficiaryName" },
    { label: "Bank Name", key: "bankDetails.bankName" },
    { label: "Branch Name", key: "bankDetails.branchName" },
    { label: "Account Number", key: "bankDetails.accountNumber" },
    { label: "IFSC Code", key: "bankDetails.ifsccode" },
    { label: "UPI Id", key: "bankDetails.upiid" }
  ];
  actions: boolean = false;
  deleteDealerElement: DealerElement | null = null;
  deleteMessage: string = "";
  deleteDialog: boolean = false;

  formCreation: { label: string, key: string, value: string, type: string, validation: string[] }[] = [
    { label: "Company Name", key: "companyName", value: '', type: 'text', validation: ['required'] },
    { label: "Buisness Email", key: "businessEmail", value: '', type: 'email', validation: ['required', 'email'] },
    { label: "Buisness Phone Number", key: "businessPhoneNumber", value: '', type: 'text', validation: ['required'] },
    { label: "Address", key: "address", value: '', type: 'textarea', validation: ['required'] },
    { label: "Services", key: "services", value: '', type: 'select', validation: ['required'] },
    { label: "GST Number", key: "gstNumber", value: '', type: 'text', validation: ['required'] },
    { label: "Beneficiary Name", key: "bankDetails.beneficiaryName", value: '', type: 'text', validation: ['required'] },
    { label: "Bank Name", key: "bankDetails.bankName", value: '', type: 'text', validation: ['required'] },
    { label: "Branch Name", key: "bankDetails.branchName", value: '', type: 'text', validation: ['required'] },
    { label: "Account Number", key: "bankDetails.accountNumber", value: '', type: 'text', validation: ['required'] },
    { label: "IFSC Code", key: "bankDetails.ifsccode", value: '', type: 'text', validation: ['required'] },
    { label: "UPI Id", key: "bankDetails.upiid", value: '', type: 'text', validation: ['required'] }
  ];

  newformCreation: { label: string, key: string, value: string, type: string, validation: string[] }[] = [
    { label: "Company Name", key: "companyName", value: '', type: 'text', validation: ['required'] },
    { label: "Buisness Email", key: "businessEmail", value: '', type: 'email', validation: ['required', 'email'] },
    { label: "Buisness Phone Number", key: "businessPhoneNumber", value: '', type: 'text', validation: ['required'] },
    { label: "Address", key: "address", value: '', type: 'textarea', validation: ['required'] },
    { label: "Services", key: "services", value: '', type: 'select', validation: ['required'] },
    { label: "GST Number", key: "gstNumber", value: '', type: 'text', validation: ['required'] },
    { label: "Beneficiary Name", key: "bankDetails.beneficiaryName", value: '', type: 'text', validation: ['required'] },
    { label: "Bank Name", key: "bankDetails.bankName", value: '', type: 'text', validation: ['required'] },
    { label: "Branch Name", key: "bankDetails.branchName", value: '', type: 'text', validation: ['required'] },
    { label: "Account Number", key: "bankDetails.accountNumber", value: '', type: 'text', validation: ['required'] },
    { label: "IFSC Code", key: "bankDetails.ifsccode", value: '', type: 'text', validation: ['required'] },
    { label: "UPI Id", key: "bankDetails.upiid", value: '', type: 'text', validation: ['required'] }
  ];
  createDealerForm: boolean = false;
  editDealerForm: boolean = false;
  formMessage: string = '';
  services: any = [];
  pageServices: any = [{ label: "Register Dealer", icon: "add", value: "register" }]

  constructor(private dealersService: DealersService, private toasterService: ToasterService, private breakpointObserver: BreakpointObserver, private servicesService: ServicesService) {
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
          { label: 'Company Name', key: 'companyName' }
        ];
        this.actions = true;
      } else if (result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Small]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Company Name', key: 'companyName' },
          { label: 'Business Email', key: 'businessEmail' },
          { label: 'Actions', key: 'actions' }
        ];
        this.actions = false;
      } else if (result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Company Name', key: 'companyName' },
          { label: 'Business Email', key: 'businessEmail' },
          { label: 'Business Phone Number', key: 'businessPhoneNumber' },
          { label: 'Address', key: 'address' },
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
  }

  ngAfterViewInit(): void {
    this.initializeBreakpointObserver();
  }

  refresh(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.getDealers();
  }

  getServices() {
    this.servicesService.getServices().subscribe((data: any) => {
      for (let d of data) {
        this.services.push(d.label.trim());
      }
      console.log(this.services)
      this.toasterService.success("Services Fetched SuccessFully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    })
  }

  getDealers() {
    this.dealersService.getDealersList(this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
      (data: any) => {
        this.dealersData = data.content;
        this.pageEvent = { pageIndex: data.number, pageSize: data.size, length: data.totalElements };
        this.length = data.totalElements;
        this.toasterService.success("Dealers Fetched Successfully")
      },
      (error: any) => {
        console.log(error);
        this.toasterService.error(error.message);
      }
    );
  }

  createDealers(element: any) {
    this.dealersService.createDealer(element)
      .pipe(finalize(() => this.getDealers()))
      .subscribe(
        () => {
          this.toasterService.success("Dealer Registered Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  updateDealers(element: any) {
    this.dealersService.updateDealer(element)
      .pipe(finalize(() => this.getDealers()))
      .subscribe(
        () => {
          this.toasterService.success("Dealer Updated Successfully");
        },
        (error: any) => {
          this.toasterService.error(error.message || "Request failed");
        }
      );
  }

  deleteDealers() {
    if (this.deleteDealerElement) {
      this.dealersService.deleteDealer(this.deleteDealerElement.id)
        .pipe(finalize(() => this.getDealers()))
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
    this.formCreation.forEach(field => {
      const key = field.key;
      if (key.startsWith('bankDetails.')) {
        const bankKey = key.split('.')[1];
        field.value = dealer.bankDetails?.[bankKey] ?? '';
      } else {
        field.value = (dealer as any)[key] ?? '';
      }
    });
  }

  editElement(event: any) {
    event.services = event.services.split(',').map((v: any) => v.trim()).filter((v: any) => v);
    this.populateFormCreationValuesFromDealer(event);
    this.formMessage = "Editing Dealers Info";
    this.editDealerForm = true;
  }

  createElement() {
    this.formMessage = "Register Dealers Info";
    this.editDealerForm = true;
  }

  deleteElement(event: any) {
    this.deleteDealerElement = event;
    this.deleteMessage = "Are you sure you want to delete the Dealer with Company Name: " + event.companyName;
    this.deleteDialog = true;
  }

  cancelProcess(event: any) {
    this.deleteDialog = event;
    this.deleteDealerElement = null;
  }

  deleteProcess(event: any) {
    this.deleteDealers();
    this.deleteDialog = false;
    this.deleteDealerElement = null;
  }

  cancelSubmission(event: any) {
    this.editDealerForm = false;
  }

  submitSubmission(event: any) {
    event.bankDetailsJson = JSON.stringify(event.bankDetails);
    event.services = event.services.join(',');
    delete event.bankDetails;
    this.updateDealers(event);
    this.editDealerForm = false;
  }

  newRegisteration() {
    this.createDealerForm = true;
  }

  cancelRegisteration(event: any) {
    this.createDealerForm = false;
  }

  submitRegisteration(event: any) {
    event.bankDetailsJson = JSON.stringify(event.bankDetails);
    event.services = event.services.join(',');
    delete event.bankDetails;
    this.createDealers(event);
    this.createDealerForm = false;
  }

}

export interface DealerElement {
  id: number,
  companyName: string,
  businessEmail: string,
  businessPhoneNumber: string,
  address: string,
  services: string,
  verifiedBuisnessEmail: boolean,
  verifiedBuisnessPhoneNumber: boolean,
  gstNumber: string,
  bankDetails: {
    beneficiaryName: string,
    bankName: string,
    branchName: string,
    accountNumber: string,
    ifsccode: string,
    upiid: string
  }
}
