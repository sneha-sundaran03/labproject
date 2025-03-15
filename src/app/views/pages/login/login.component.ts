import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms'; // Import FormsModule
// import { MyserviceService } from 'src/app/myservice.service';
import { MyserviceService } from '../../../myservice.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule
  ],
})
export class LoginComponent {

  loginName: string = '';
  password: string = '';
  errorMessage: string = '';
  loginNameError: boolean = false;
  passwordError: boolean = false;
  isLoading = false;

  constructor(private routes: Router,
    private myservice: MyserviceService
  ) {}

  login(): void {
    const payload = { LOGIN_NAME: this.loginName, PASSWORD: this.password };
    this.isLoading = true;
    this.myservice.login(payload).subscribe(
      (response: any) => {
console.log(response,"loginresponse")
        // Check if the response contains a flag indicating success
        if (response && response.flag === 1) {
          
          sessionStorage.setItem('userId',response.data.USER_ID)
          sessionStorage.setItem('nserName',response.data.USER_NAME);

          this.myservice.setAuthenticationStatus(true);
          this.routes.navigateByUrl('/Home/base/tabs/add');
          this.isLoading = false;
        } else {
          this.isLoading = true;
          // Show error message if login failed
          this.errorMessage = response.message || 'Invalid username or password.';
          // Set error flags
          this.loginNameError = !this.loginName;
          this.passwordError = !this.password;
          this.isLoading = false;
        }
      },
      (error) => {
        // Handle network or other errors
        console.error('Login failed:', error);
        this.errorMessage = 'An error occurred while logging in. Please try again.';
        this.loginNameError = true;
        this.passwordError = true;
      }
    );
  }

  isInputInvalid(modelValue: any, ngModel: NgModel): boolean {
    return !modelValue && !!ngModel?.invalid && !!ngModel?.touched;
  }
  
  

  
}
