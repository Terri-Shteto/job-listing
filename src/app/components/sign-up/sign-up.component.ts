import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  Auth,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(
    private auth: Auth,
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
    });
  }

  ngOnInit(): void {
  }

  public signUp() {
    const { email, password } = this.signUpForm.value;

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        return this.showSnackBar('Sign-up complete!');
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/email-already-in-use') {
          this.showSnackBar('This email is already in use!');
        }

        this.showSnackBar('Username or password is invalid!');

        throw error;
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
    }[controlName] as any)[errorName] || 'Invalid field!';
  }

}
