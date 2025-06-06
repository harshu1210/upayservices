import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { DealerComponent } from './components/dealer/dealer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoadingInterceptor } from './services/interceptor.service';
import { TableComponent } from './shared/table/table.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ServicesComponent } from './components/services/services.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';
import { FormComponent } from './shared/form/form.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { WildCardComponent } from './shared/wild-card/wild-card.component';
import { UserComponent } from './components/user/user.component';
import { SessionExtendComponent } from './shared/session-extend/session-extend.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerComponent } from './component/customer/customer.component';
import { OrderComponent } from './component/order/order.component';
import { PackageTrackingComponent } from './component/package-tracking/package-tracking.component';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DealerComponent,
    SpinnerComponent,
    TableComponent,
    ServicesComponent,
    DeleteDialogComponent,
    FormComponent,
    WildCardComponent,
    UserComponent,
    SessionExtendComponent,
    LoginComponent,
    CustomerComponent,
    OrderComponent,
    PackageTrackingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatAutocompleteModule,
    NgxFileDropModule,
    MatCardModule,
    MatStepperModule,
    MatProgressBarModule,
    MatExpansionModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
