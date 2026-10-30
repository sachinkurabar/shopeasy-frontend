
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product, ProductService } from '../../services/product';

@Component({
  selector: 'app-home',
  imports: [ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  products: Product[] = [];

  testMessage = 'HOME COMPONENT UPDATED';
constructor(
  private productService: ProductService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {

    this.productService.getAllProducts().subscribe({
    next: (data) => {
  console.log('Products received:', data);
  console.log('Is response an array?', Array.isArray(data));
  console.log('Number of products:', data?.length);
  this.products = data;
   this.cdr.detectChanges();
},

      error: (error) => {
        console.error('Error loading products:', error);
      }
    });

  }
}