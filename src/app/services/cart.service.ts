import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;       --> Used for session of browser, if we close that the data disapers
  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      this.computeCartTotals();
    }
   }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart

    let alreadyExistInCart: boolean = false;
    let existingInCart: CartItem | undefined;

    // refactor
    // if(this.cartItems.length > 0){
    // //find the item in the card based on item id
    //   for(let tempCartItem of this.cartItems){
    //     if(tempCartItem.id === theCartItem.id){
    //       existingInCart = tempCartItem;
    //       break;
    //     }
    //   }
    // }
    existingInCart = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      alreadyExistInCart = (existingInCart != undefined);


    if(alreadyExistInCart){
      existingInCart!.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice!; //USO DE !, ? y undefined
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debug
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    // console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice!;
      // console.log(`name=${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotal=${subTotalPrice},`);
    }

    // console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    // console.log('------');

    /* Persist Cart Data */
    this.persistCarItems();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();
    }
  }

  persistCarItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
