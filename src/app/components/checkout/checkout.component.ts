import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup?: FormGroup;

  //Luv2ShopService --> getCreditCard Months and Years
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cartType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    //Luv2ShopService --> getCreditCard Months and Years --> populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: "+startMonth);

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //Luv2ShopService --> getCreditCard Months and Years --> populate credit card years
    this.luv2ShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );


  }

  onSubmit(){
    console.log("Handlign the submit button");
    console.log(this.checkoutFormGroup?.get('customer')?.value);
    console.log(`The email address is: ${this.checkoutFormGroup?.get('customer')?.value.email}`);
  }

  copyShippingAddressToBillingAddress(event : any){
    
    if(event.target.checked){
      this.checkoutFormGroup?.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }else{
      this.checkoutFormGroup?.controls['billingAddress'].reset();
    }

  }
}
