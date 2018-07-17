import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bwm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formData: any = {};
  errors: any[] = [];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register(){
    console.log("formData : " + this.formData);
    
    this.auth.register(this.formData).subscribe(
      (data)=> {
        console.log("success!", data);
        this.router.navigate(['/login', {registered: 'success'}]);
      },(err) => {
        this.errors = err.error.errors;
      }
    )
  }
}
