import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class TableComponent implements OnInit {

  @Input() header: string = "";
  @Input() dataSource = [];
  @Input() columnsToDisplay: { label: string, key: string }[] = []
  @Input() displayedColumnKeys = {};
  @Input() length = 0;
  @Input() pageSize = 0;
  @Input() pageSizeOptions: number[] = []
  @Input() pageEvent: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.length };
  @Input() formToDisplay: { label: string, key: string }[] = []
  @Input() expandable: boolean = false;
  @Input() actions: boolean = false;
  @Input() pageServices: any = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  @Output() refresh: EventEmitter<PageEvent> = new EventEmitter();
  @Output() editing: EventEmitter<any> = new EventEmitter();
  @Output() deleting: EventEmitter<any> = new EventEmitter();
  @Output() register: EventEmitter<any> = new EventEmitter();
  expandedElement: any = null;
  deletePermission: boolean = false;

  constructor(private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.deletePermission = this.storageService.extractToken().includes("SUPERADMIN") || this.storageService.extractToken().includes("ADMIN");
  }

  updatePage(event: any) {
    this.pageEvent = { pageIndex: event.pageIndex, pageSize: event.pageSize, length: event.length };
    this.refresh.emit(this.pageEvent);
  }

  editElement(event: any) {
    this.editing.emit(event);
  }

  deleteElement(event: any) {
    this.deleting.emit(event);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  menuService(label: string) {
    if (label == 'register') {
      this.register.emit();
    }
  }


}