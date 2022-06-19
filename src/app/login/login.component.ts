import { AuthUser } from 'src/app/Models/AuthUser';
import { AuthServiceService } from './../API/Auth/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Notify } from 'notiflix';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb : FormBuilder, private auth : AuthServiceService, private router : Router) { }

  flogin = this.fb.group({
    email : ['',[Validators.required,Validators.email]],
    password : ['',[Validators.required,Validators.minLength(8)]]
  });

  formInvalid : boolean = false;

  response !: AuthUser;

  get getEmail() {return this.flogin.get('email')}
  get getPassword() {return this.flogin.get('password')}

  ngOnInit(): void {
    
  }

  login() {

      Notify.init({
        useFontAwesome: true,
        fontFamily: 'Nunito',
        fontSize: '15px',
        width: '300px',
        cssAnimationStyle : 'from-top',
        failure : {
          fontAwesomeClassName: 'fa-solid fa-user-lock',
          fontAwesomeIconColor: '#ffffff',
        }
    });

    if(this.flogin.valid)
    {
      let email = this.getEmail?.value as string;
      let password = this.getPassword?.value as string;

      this.auth.login(email,password).subscribe((data)=>{
        if(data.response.status)
        {
          localStorage.setItem('user',JSON.stringify(data));

          this.router.navigate(['/main/dashboard']);
        }
        else
        {
          Notify.failure(" Erreur lors de la connexion, merci de vérifier votre adresse e-mail et/ou votre mot de passe.")
        }
      });
    }
    else
    {
      this.formInvalid = true;
    }
  }

}
