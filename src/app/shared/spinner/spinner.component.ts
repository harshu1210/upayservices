import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css'],
    standalone: false
})
export class SpinnerComponent implements OnInit {

  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

}
