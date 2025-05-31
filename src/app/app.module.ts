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
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoadingInterceptor } from './services/interceptor.service';
import { TableComponent } from './shared/table/table.component';
import { MatInputModule } from '@angular/material/input';
import { ServicesComponent } from './components/services/services.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';
import { FormComponent } from './shared/form/form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { WildCardComponent } from './shared/wild-card/wild-card.component';
import { UserComponent } from './components/user/user.component';
import { SessionExtendComponent } from './shared/session-extend/session-extend.component';
import { LoginComponent } from './components/login/login.component';
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
    MatMenuModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
