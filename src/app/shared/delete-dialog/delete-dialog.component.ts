import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.css'],
    standalone: false
})
export class DeleteDialogComponent implements OnInit {

  @Input() message: string = "";

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  cancelProcess(event: boolean) {
    this.cancel.emit(event);
  }

  deleteProcess(event: boolean) {
    this.delete.emit(event);
  }



}
