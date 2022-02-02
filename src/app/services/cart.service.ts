import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart

    let alreadyExistInCart: boolean = false;
    let existingInCart: CartItem | undefined;

    if(this.cartItems.length > 0){
    //find the item in the card based on item id
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingInCart = tempCartItem;
          break;
        }
      }

      alreadyExistInCart = (existingInCart != undefined);
    }

    if(alreadyExistInCart){
      existingInCart!.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(){
      //TODO
  }
}
