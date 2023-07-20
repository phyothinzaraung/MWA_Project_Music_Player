import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../interfaces/IUser.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  #auth = inject(AuthService);
  #router = inject(Router);

  signup_form = inject(FormBuilder).group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signup(){
    console.log(this.signup_form.value);
    this.#auth.signup(this.signup_form.value as IUser).subscribe(response => {
        if(response.success){
          this.#router.navigate(['/login']);
        }else{
          console.log("sign up fail");
        }
    });
  }

}
