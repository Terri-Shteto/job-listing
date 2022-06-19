import { Component, OnInit } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AppService } from '../../app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;

  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private appService: AppService,
    private formBuilder: FormBuilder,
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: [this.appService.userData?.get('firstName') || '', Validators.compose([
        Validators.required,
      ])],
      lastName: [this.appService.userData?.get('lastName') || '', Validators.compose([
        Validators.required,
      ])],
      email: [this.appService.userData?.get('email') || this.appService.user?.email || '', Validators.compose([
        Validators.required,
        Validators.email,
      ])],
      phone: [this.appService.userData?.get('phone') || '', Validators.compose([
        Validators.required,
      ])],
      gender: [this.appService.userData?.get('gender') || '', Validators.compose([])],
    });
  }

  public ngOnInit(): void { }

  public async updateProfile() {
    const fields = this.profileForm.value;

    const user = this.appService.user;
    const userRef = doc(this.firestore, `users/${user?.uid}`);

    await updateDoc(userRef, fields);

    this.showSnackBar('Profile updated!');
  }

  protected showSnackBar(message: string, action: string = '', options: MatSnackBarConfig<any> = {}) {
    this.snackBar.open(message, action, Object.assign({
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    }, options));
  }

  public hasError(controlName: string) {
    const control = this.profileForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  public getError(controlName: string) {
    if (!this.hasError(controlName)) {
      return '';
    }

    return Object.keys(this.profileForm.controls[controlName].errors || {})[0];
  }

  public getErrorMessage(controlName: string) {
    const errorName = this.getError(controlName);

    return ({
      firstName: {
        required: 'First name is required!',
      },
      lastName: {
        required: 'Last name is required!',
      },
      email: {
        required: 'Email is required!',
        email: 'Must be a valid email!',
      },
      phone: {
        required: 'Phone is required!',
      },
      gender: {
        required: 'Gender is required',
      },
    }[controlName] as any)[errorName] || 'Invalid field!';
  }
}
