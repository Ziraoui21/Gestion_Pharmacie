import { Confirm, Notify } from 'notiflix';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from './../../Models/User';
import { UserService } from './../../API/Users/user.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit,OnDestroy{

  @ViewChild(DataTableDirective, {static: false})
  dtElement !: DataTableDirective;

  users !:User[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private usersAPI : UserService, private fb : FormBuilder) { }

  fcreate = this.fb.group({
    name : ['',Validators.required],
    email : ['',[Validators.required,Validators.email]],
    newPassword : ['',[Validators.required,Validators.minLength(8)]],
    confirmPassword : ['',Validators.required],
    role_id : ['',Validators.required]
  })

  formInvalid : boolean = false;

  get getName(){ return this.fcreate.get('name'); }
  get getEmail(){ return this.fcreate.get('email'); }
  get getNewPassword(){ return this.fcreate.get('newPassword'); }
  get getConfirmPassword(){ return this.fcreate.get('confirmPassword'); }
  get getRoleId(){ return this.fcreate.get('role_id'); }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
    };

    this.usersAPI.users().subscribe((data)=>{
      this.users = data;
      this.dtTrigger.next(0);
    });
  
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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  create()
  {
    
    if(this.fcreate.valid && this.checkConfirmpassword())
    {
      
      let newUser = new User();
      newUser.email = this.getEmail?.value;
      newUser.name = this.getName?.value;
      newUser.role_id = this.getRoleId?.value;
      newUser.password = this.getNewPassword?.value;

      this.usersAPI.create(newUser).subscribe((data)=>{
        if(data.status)
        {
          Notify.success("l'enregistrement a réussie");
          this.reloadUsers();
          this.resetForm();
        }
        else
        {
          Notify.failure("Cet email déja utilisé par un autre utilisateur");
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

  delete(userDeleted : User)
  {
    Confirm.init({
      okButtonBackground : "#e84118",
      titleColor : "#2f3640"
    });

    Confirm.show(
      'Supprimer',
      `Voulez vous vraiment supprimer l'utilisateur ${userDeleted?.name}`,
      'Oui',
      'Nom',
      () => {
        this.usersAPI.delete(userDeleted).subscribe((data)=>{

          if(data.status)
          {
            Notify.success("la suppression a réussie");
            this.reloadUsers();
          }

        })
      },
    );
  }

  setAdmin(id : number)
  {
    Confirm.init({
      titleColor : "#2f3640"
    });

    Confirm.show(
      'changer le role',
      `Voulez vous vraiment changer le role de cet utilisateur`,
      'Oui',
      'Nom',
      () => {
        this.usersAPI.setAdmin(id).subscribe((data)=>{

          if(data.status)
          {
            Notify.success("le changement de role a réussie");
            this.reloadUsers();
          }

        })
      },
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

  reloadUsers()
  {
    this.usersAPI.users().subscribe((data)=>{
      this.rerender();
      this.users = data;
    });
  }

  resetForm()
  {
    this.fcreate.reset();
    this.formInvalid = false;
    const select = document.getElementById('role') as HTMLSelectElement | null;
    if (select != null) {
      select.selectedIndex = 0;
    }
  }

}
