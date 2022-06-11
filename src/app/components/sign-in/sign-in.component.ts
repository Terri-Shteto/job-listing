import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  Auth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public signInForm: FormGroup;

  constructor(
    private auth: Auth,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])],
    });
  }

  ngOnInit(): void {
  }

  public signIn() {
    const { email, password } = this.signInForm.value;

    signInWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        this.showSnackBar('Sign-in complete!');
      })
      .catch((error: FirebaseError) => {
        this.showSnackBar('Username or password is invalid!');
      });
  }

  public showSnackBar(message: string, action: string = '', options: MatSnackBarConfig<any> = {}) {
    this.snackBar.open(message, action, Object.assign({
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    }, options));
  }

  public hasError(controlName: string) {
    const control = this.signInForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  public getError(controlName: string) {
    if (!this.hasError(controlName)) {
      return '';
    }

    return Object.keys(this.signInForm.controls[controlName].errors || {})[0];
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
    }[controlName] as any)[errorName] || 'Invalid field!';
  }

}
