import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public signInForm: FormGroup;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
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

  public ngOnInit(): void { }

  public signIn() {
    const { email, password } = this.signInForm.value;

    signInWithEmailAndPassword(this.auth, email, password)
      .then((response) => this.handleSignInSuccess(response))
      .catch((error) => this.handleSignInFailure(error))
    ;
  }

  protected async handleSignInSuccess(response: UserCredential) {
    console.log({ response });
    this.showSnackBar('Sign-in complete!');
  }

  protected handleSignInFailure(error: FirebaseError) {
    console.log({ error });
    this.showSnackBar('Username or password is invalid!');
  }

  protected showSnackBar(message: string, action: string = '', options: MatSnackBarConfig<any> = {}) {
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
