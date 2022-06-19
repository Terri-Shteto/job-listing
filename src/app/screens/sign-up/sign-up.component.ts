import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { UserCredential, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AppService } from '../../app.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(
    private appService: AppService,
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])],
      firstName: ['', Validators.compose([
        Validators.required,
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
      ])],
      role: ['', Validators.compose([
        Validators.required,
      ])],
      phone: ['', Validators.compose([
        Validators.required,
      ])],
      gender: ['', Validators.compose([])],
    });
  }

  public ngOnInit(): void { }

  public signUp() {
    const { email, password } = this.signUpForm.value;

    createUserWithEmailAndPassword(this.appService.auth, email, password)
      .then(response => this.handleRegistrationSuccess(response))
      .catch(error => this.handleRegistrationFailure(error))
    ;
  }

  protected async handleRegistrationSuccess(response: UserCredential) {
    const userId = response.user.uid;
    const userRef = doc(this.firestore, `users/${userId}`);

    // Remove password from user data because it is saved in auth module.
    const { password: _, ...data } = this.signUpForm.value;

    await setDoc(userRef, data);

    this.showSnackBar('Sign-up complete!');
  }

  protected handleRegistrationFailure(error: FirebaseError) {
    let message = 'Username or password is invalid!';

    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already in use!';
    }

    console.log({ error });
    this.showSnackBar(message);
  }

  protected showSnackBar(message: string, action: string = '', options: MatSnackBarConfig<any> = {}) {
    this.snackBar.open(message, action, Object.assign({
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    }, options));
  }

  public hasError(controlName: string) {
    const control = this.signUpForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  public getError(controlName: string) {
    if (!this.hasError(controlName)) {
      return '';
    }

    return Object.keys(this.signUpForm.controls[controlName].errors || {})[0];
  }

  public getErrorMessage(controlName: string) {
    const errorName = this.getError(controlName);

    return ({
      email: {
        required: 'Email is required!',
        email: 'Email must be a valid email!',
      },
      password: {
        required: 'Password is required',
        minlength: 'Password must less than 6 characters!',
      },
      firstName: {
        required: 'First name is required!',
      },
      lastName: {
        required: 'Last name is required!',
      },
      role: {
        required: 'Role is required',
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
