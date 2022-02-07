import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private luv2ShopService: Luv2ShopFormService,
              private cartServie: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.reviewCartDetails();

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

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
        email:  new FormControl(theEmail, 
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

    if(this.checkoutFormGroup?.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartServie.cartItems;

    // create orderItrms from cartItems

    /* - long way
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way
    let orderItemShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup?.controls['customer'].value;

    // populate purchase - shipp Addr
    purchase.shippingAddress = this.checkoutFormGroup?.controls['shippingAddress'].value;

    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));

    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;

    // populate purchase - bill Addr
    purchase.billingAddress = this.checkoutFormGroup?.controls['billingAddress'].value;

    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));

    purchase.billingAddress!.state = billingState.name;
    purchase.billingAddress!.country = billingCountry.name;

    // populate purchase - order & orderItems
    purchase.order = order;
    purchase.orderItems = orderItemShort;

    // call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received. \nOrder tacking number: ${response.orderTrackingNumber}`);

          //TODO: reset cart --> DONE
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    );

    /*-----------------------------------------LOGS---------------------------------------------*/
    //
    //
    // console.log("Handlign the submit button");
    // console.log(this.checkoutFormGroup?.get('customer')?.value);
    // console.log(`The email address is: ${this.checkoutFormGroup?.get('customer')?.value.email}`);
    // console.log("The shipping addres country is " + this.checkoutFormGroup?.get('shippingAddress')?.value.country.name);
    // console.log("The shipping addres state is " + this.checkoutFormGroup?.get('shippingAddress')?.value.state.name);
    //
    //
    /*-----------------------------------------LOGS---------------------------------------------*/
  }

  resetCart() {
    // reset cart data
    this.cartServie.cartItems = [];
    this.cartServie.totalPrice.next(0);
    this.cartServie.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup?.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
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
