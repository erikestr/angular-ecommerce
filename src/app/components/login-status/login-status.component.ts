import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js'
import { OKTA_AUTH } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean | undefined;
  userFullName: string | undefined;

  constructor(@Inject(OKTA_AUTH) public oktaAuthService: OktaAuth) { }

  ngOnInit(): void {

    // Subscribe to authtentication state changfges

    this.oktaAuthService.authStateManager.subscribe(
      (result: any) => {
        console.log("result for authStateManager: "+ JSON.stringify(result))
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if(this.isAuthenticated){
      //fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name

      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuthService.signOut();
  }
}
