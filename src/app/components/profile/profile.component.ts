import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.profileForm = this.formBuilder.group({
      phone: ['', Validators.compose([
        Validators.required,
      ])],
      gender: ['', Validators.compose([])],
    });
  }

  public ngOnInit(): void { }

  public async updateProfile() {
    const fields = this.profileForm.value;

    const user = this.auth.currentUser;
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
      phone: {
        required: 'Phone is required!',
      },
      gender: {
        required: 'Gender is required',
      },
    }[controlName] as any)[errorName] || 'Invalid field!';
  }

}
