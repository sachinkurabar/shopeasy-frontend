
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Cart as CartService } from '../../services/cart';
import { Product } from '../../services/product';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  submitted = false;
  orderPlaced = false;
  placingOrder = false;
  orderNumber = '';
  confirmedTotal = 0;
  orderError = '';

  deliveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef

  ) {
    this.deliveryForm = this.fb.group({
      fullName: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],

      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],

      pincode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]]
    });
  }

  get cartItems(): Product[] {
    return this.cartService.getCartItems();
  }

  getQuantity(product: Product): number {
    return this.cartService.getQuantity(product);
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  onSubmit(): void {
    this.submitted = true;
    this.orderError = '';

    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      return;
    }

    if (this.cartItems.length === 0) {
      this.orderError =
        'Your cart is empty. Please add a product first.';
      return;
    }

    if (this.placingOrder) {
      return;
    }

    const formValue = this.deliveryForm.getRawValue();

    const request = {
      customerName: formValue.fullName,
      email: formValue.email,
      shippingAddress:
        `${formValue.address}, ${formValue.city}, ${formValue.state}`,
      pincode: formValue.pincode,
      items: this.cartItems.map(product => ({
        productId: product.id,
        quantity: this.getQuantity(product)
      }))
    };

    this.placingOrder = true;

    console.log('Sending order request:', request);

    this.orderService.placeOrder(request).subscribe({
      next: response => {
        console.log('Order confirmed:', response);

        this.orderNumber = `SE-${response.orderId}`;
        this.confirmedTotal = response.totalAmount;

        this.orderPlaced = true;
        this.placingOrder = false;

        this.cartService.clearCart();

        this.cdr.detectChanges();   

        console.log('Checkout state:', {
                orderPlaced: this.orderPlaced,
                 placingOrder: this.placingOrder
      });
      },

      error: error => {
        this.placingOrder = false;

        console.error('Order placement failed:', error);

        if (error.status === 0) {
          this.orderError =
            'Cannot connect to the server. Check that Spring Boot is running.';
        } else if (error.status === 400) {
          this.orderError =
            error.error?.message ||
            'Order details are invalid. Please check your details and stock.';
        } else if (error.status === 404) {
          this.orderError =
            'A product or endpoint was not found. Please refresh and try again.';
        } else {
          this.orderError =
            'Unable to place your order. Please check the server logs.';
        }
      }
    });
  }
}
