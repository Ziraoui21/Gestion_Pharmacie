import { Notify } from 'notiflix';
import { AuthUser } from './../../../Models/AuthUser';
import { AuthServiceService } from 'src/app/API/Auth/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private auth : AuthServiceService, private fb : FormBuilder) { }

  user : AuthUser = JSON.parse(localStorage.getItem('user') as string) as AuthUser;
  formInvalid : boolean = false;

  fedit = this.fb.group({
      name : [this.user.name,Validators.required],
      email : [this.user.email,[Validators.required,Validators.email]],
      newPassword : ['',Validators.minLength(8)],
      confirmPassword : ['']
  })

  get getName(){ return this.fedit.get('name'); }
  get getEmail(){ return this.fedit.get('email'); }
  get getNewPassword(){ return this.fedit.get('newPassword'); }
  get getConfirmPassword(){ return this.fedit.get('confirmPassword'); }

  ngOnInit(): void {
    
  }

  edit(){

    Notify.init({
      useFontAwesome: true,
      fontFamily: 'Nunito',
      fontSize: '15px',
      width: '300px',
      cssAnimationStyle : 'from-top',
      success : {
        fontAwesomeClassName: 'fa-solid fa-circle-check',
        fontAwesomeIconColor: '#ffffff',
      },
      failure : {
        fontAwesomeClassName: 'fa-solid fa-exclamation',
        fontAwesomeIconColor: '#ffffff',
      }
    });

    if(this.fedit.valid && this.checkConfirmpassword())
    {
        this.user.email = this.getEmail?.value;
        this.user.name = this.getName?.value;

        if(this.getNewPassword?.value!='') 
          this.user.newPassword = this.getNewPassword?.value;
        
        this.auth.editUser(this.user).subscribe((data)=>{
          if(data.status)
          {
            Notify.success('Modification est réussie')

            localStorage.setItem('user',JSON.stringify(this.user));
            this.getConfirmPassword?.reset();
            this.getNewPassword?.reset();
            document.getElementById('close')?.click();
          }
          else
          {
            Notify.failure("Cette email déja utilisé par un autre utilisateur")
          }
        })
    }
    else
    {
      this.formInvalid = true;
    }
  }

  checkConfirmpassword(): boolean{

    const newPassword : string = this.getNewPassword?.value;
    const confirmPassword : string = this.getConfirmPassword?.value;

    if(newPassword == confirmPassword)
      return true;
    else
      return false;
  }
}
