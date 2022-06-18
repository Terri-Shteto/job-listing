import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { HomeComponent } from './screens/home/home.component';
import { SignInComponent } from './screens/sign-in/sign-in.component';
import { SignUpComponent } from './screens/sign-up/sign-up.component';
import { SignOutComponent } from './screens/sign-out/sign-out.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { JobOffersComponent } from './screens/job-offers/job-offers.component';
import { JobFavoritesComponent } from './screens/job-favorites/job-favorites.component';
import { JobApplicationsComponent } from './screens/job-applications/job-applications.component';

const redirectUnauthenticatedToLogin = () => redirectUnauthorizedTo(['sign-in', 'sign-up']);
// const redirectUnauthorizedHome = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-out',
    component: SignOutComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
  {
    path: 'job-offers',
    component: JobOffersComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
  {
    path: 'job-favorites',
    component: JobFavoritesComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
  {
    path: 'job-applications',
    component: JobApplicationsComponent,
    ...canActivate(redirectUnauthenticatedToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
