import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

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

  //Luv2ShopService --> Countries and States
  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopService: Luv2ShopFormService,
              private cartServie: CartService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        // validation
        // firstName: [''],
        firstName: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        email:  new FormControl('', 
                              [ Validators.required, 
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        zipCode: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [ Validators.required ]),
        nameOnCard: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [ Validators.required, Validators.pattern('[0-9]{16}') ]),
        securityCode: new FormControl('', [ Validators.required, Validators.pattern('[0-9]{3}') ]),
        expirationMonth: [''],
        expirationYear: ['']
        // expirationMonth: new FormControl('', [ Validators.required ]),
        // expirationYear: new FormControl('', [ Validators.required ])
      })
    });

    // Luv2ShopService --> getCreditCard Months and Years --> populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: "+startMonth);

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // Luv2ShopService --> getCreditCard Months and Years --> populate credit card years
    this.luv2ShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Luv2ShopService --> populate countries
    this.luv2ShopService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: "+ JSON.stringify(data));
        this.countries = data;
      }
    );

    this.reviewCartDetails();
  }

  get firstName(){ return this.checkoutFormGroup?.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup?.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup?.get('customer.email'); }
  
  get shippingAddressStreet(){ return this.checkoutFormGroup?.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup?.get('shippingAddress.city'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup?.get('shippingAddress.country'); }
  get shippingAddressState(){ return this.checkoutFormGroup?.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup?.get('shippingAddress.zipCode'); }

  
  get billingAddressStreet(){ return this.checkoutFormGroup?.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup?.get('billingAddress.city'); }
  get billingAddressCountry(){ return this.checkoutFormGroup?.get('billingAddress.country'); }
  get billingAddressState(){ return this.checkoutFormGroup?.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup?.get('billingAddress.zipCode'); }

  
  get creditCardType(){ return this.checkoutFormGroup?.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup?.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup?.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup?.get('creditCard.securityCode'); }
  // get creditCardExpirationMonth(){ return this.checkoutFormGroup?.get('creditCard.expirationMonth'); }
  // get creditCardExpirationYear(){ return this.checkoutFormGroup?.get('creditCard.expirationYear'); }

  onSubmit(){
    console.log("Handlign the submit button");

    if(this.checkoutFormGroup?.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup?.get('customer')?.value);
    console.log(`The email address is: ${this.checkoutFormGroup?.get('customer')?.value.email}`);

    console.log("The shipping addres country is " + this.checkoutFormGroup?.get('shippingAddress')?.value.country.name);
    console.log("The shipping addres state is " + this.checkoutFormGroup?.get('shippingAddress')?.value.state.name);
  }

  copyShippingAddressToBillingAddress(event : any){

    //TODO: if user change data from Shipping Address refresh data on Billing Address 
    
    if(event.target.checked){
      this.checkoutFormGroup?.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug about copy states to the billing addres states
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup?.controls['billingAddress'].reset();

      // bug about copy states to the billing addres states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup?.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getSates(formGroupName: string){

    const formGroup = this.checkoutFormGroup?.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  reviewCartDetails() {
    // subscribe to cartService. total Quantity
    this.cartServie.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // subscribe to cartService. total Quantity
    this.cartServie.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }
}
