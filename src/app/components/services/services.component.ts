import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {

  servicesData: any = [];
  columnsToDisplay: { label: string, key: string }[] = [];
  displayedColumnKeys = {};
  length = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [this.pageSize, 50, 100, 500];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.length };
  deleteDialog: boolean = false;
  deleteServiceElement: Service | null = null;
  deleteMessage: string = "";
  actions: boolean = false;
  constructor(private servicesService: ServicesService, private toasterService: ToasterService, private breakpointObserver: BreakpointObserver) {
    this.initializeBreakpointObserver();
  }

  ngOnInit(): void {
    this.getServices();
  }

  ngAfterViewInit(): void {
    this.initializeBreakpointObserver();
  }

  refresh(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.getServices();
  }

  getServices() {
    this.servicesService.getServicesList(this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
      (data: any) => {
        this.servicesData = data.content;
        this.pageEvent = { pageIndex: data.number, pageSize: data.size, length: data.totalElements };
        this.length = data.totalElements;
        this.toasterService.success("Services Fetched Successfully")
      },
      (error: any) => {
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
          { label: 'Service', key: 'label' }
        ];
        this.actions = true;
      } else if (result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
        this.columnsToDisplay = [
          { label: 'ID', key: 'id' },
          { label: 'Service', key: 'label' },
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
    this.deleteServiceElement = event;
    this.deleteMessage = "Are you sure you want to delete the Service with Label: " + event.label;
    this.deleteDialog = true;

  }

  cancelProcess(event: any) {
    this.deleteDialog = event;
    this.deleteServiceElement = null;
  }

  deleteProcess(event: any) {
    this.deleteDialog = false;
    this.deleteServices();
    this.deleteServiceElement = null;
  }

  deleteServices() {
    if (this.deleteServiceElement) {
      console.log(typeof this.deleteServiceElement.id);
      this.servicesService.deleteServices(this.deleteServiceElement.id)
        .pipe(finalize(() => this.getServices()))
        .subscribe(
          () => {
            this.toasterService.success("Service Deleted Successfully");
          },
          (error: any) => {
            console.log(error)
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

export interface Service {
  id: number,
  label: string
}
