import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error: any;
  notifyMessage: string = '';

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route : ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe((params) => {
      if(params['registered'] === 'success'){
        this.notifyMessage = 'You have been successfuly registered, you can login now';
      }
    })
  }

  initForm(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password:['', Validators.required]
    })
  }

  isInvalidForm(fieldName): boolean{
    return this.loginForm.controls['email'].invalid &&
      (this.loginForm.controls['email'].dirty || this.loginForm.controls['email'].touched)
  }

  isRequire(fieldName):boolean{
    return this.loginForm.controls[fieldName].errors.required
  }

  login(){
    console.log(this.loginForm.value);
    this.auth.login(this.loginForm.value).subscribe(
      (data)=>{
        console.log("token in login comp : ", data);
        return this.router.navigate(['/rentals']);
      },
      (err)=>{
        this.error = err;
      }
    )
  }
}
