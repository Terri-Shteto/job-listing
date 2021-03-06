// Core imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';

// Local imports.
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Screen imports.
import { HomeComponent } from './screens/home/home.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { SignUpComponent } from './screens/sign-up/sign-up.component';
import { SignOutComponent } from './screens/sign-out/sign-out.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { JobOffersComponent } from './screens/job-offers/job-offers.component';
import { JobFavoritesComponent } from './screens/job-favorites/job-favorites.component';
import { JobApplicationsComponent } from './screens/job-applications/job-applications.component';

// Component imports.
import { JobListTableComponent } from './components/job-list-table/job-list-table.component';
import { JobOfferFormDialogComponent } from './components/job-offer-form-dialog/job-offer-form-dialog.component';
import { JobOfferDetailsDialogComponent } from './components/job-offer-details-dialog/job-offer-details-dialog.component';

@NgModule({
  declarations: [
    // Screens.
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    ProfileComponent,
    JobOffersComponent,
    JobFavoritesComponent,
    JobApplicationsComponent,

    // Components.
    JobListTableComponent,
    JobOfferFormDialogComponent,
    JobOfferDetailsDialogComponent,
  ],

  imports: [
    BrowserModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSortModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
  ],

  providers: [],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
