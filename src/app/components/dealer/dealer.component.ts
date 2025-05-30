import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DealersService } from 'src/app/services/dealers.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs';

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

  constructor(private dealersService: DealersService, private toasterService: ToasterService, private breakpointObserver: BreakpointObserver) {
    this.initializeBreakpointObserver();
  }


  ngOnInit(): void {
    this.getDealers();
  }

  ngAfterViewInit(): void {
    this.initializeBreakpointObserver();
  }

  refresh(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.getDealers();
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

  private updateDisplayedColumnKeys() {
    this.displayedColumnKeys = this.columnsToDisplay.map(col => col.key);
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

  editElement(event: any) {
    console.log(event);
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.initializeBreakpointObserver();
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
