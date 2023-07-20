import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/IUser.interface';
import jwt_decode from "jwt-decode";
import { IToken } from '../interfaces/IToken.interface';
import { Router } from '@angular/router'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  #auth = inject(AuthService);
  #router = inject(Router);
  isLoginSuccess: boolean = true;

  login_form = inject(FormBuilder).group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    this.#auth.signin(this.login_form.value as IUser).subscribe((response) => {
      if (response.success) {
        this.isLoginSuccess = true;
        const token = response.data;
        this.#router.navigate(['/home']);
        var decoded = jwt_decode(token) as IToken;
        console.log("Decoded", decoded);
        this.#auth.state_signal.set({
          ...decoded,
          jwt: token
        })
        localStorage.setItem("MUSIC_PLAYER_STATE", JSON.stringify(this.#auth.state_signal()));
      }else{
        console.log("Error", response.data)
      }
    },
    (error) => {
      this.isLoginSuccess = false;
    }
    );
  }
}
