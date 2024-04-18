import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from './product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { error } from 'node:console';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService,
    private formBuilder: FormBuilder) { }
  product2: Product[] = [];
  product: Product = new Product();

  products:any[]=[];

  productForm!: FormGroup;
  editProduct: Product | null = null;

  ngOnInit(): void {
    this.getAllProducts2();
    console.log(this.product2);
    this.initForm();
  }

  getAllProducts2() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.product2 = products;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

addProduct(name: string, price: number, quantity: number) {
    const newProduct = { name: name, price: price, quantity: quantity };
    this.products.push(newProduct);
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],

    })
  }


  saveProduct() {
    const product: Product = this.productForm.value;
    this.productService.addProduct(product).subscribe({
      next: (response) => {
        console.log("Product add successfully", response);
        alert("Product added");
        this.getAllProducts2();
        this.clearForm();
      },
      error: (error) => {
        console.log("Product Add failed", error);
      }
    })
  }

  clearForm() {
    this.editProduct = null;
    this.productForm.reset()
  }


  updateProduct() {
    if (this.editProduct && this.editProduct.id !== undefined) {
      this.productService.updateProduct(this.editProduct.id, this.editProduct).subscribe({
        next: () => {
          console.log("Product Updated");
          this.getAllProducts2();
          this.clearForm();
        },
        error: (error) => {
          console.log("Product Updated failed", error);
        }
      })
    }
  }

  deleteProduct(id: number | undefined): void {
    if (id != undefined) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.getAllProducts2();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    else {
      console.error("Product not deleted")
    }
  }


  editedProduct(product: Product) {
    this.editProduct = product;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      quantity: product.quantity,

    });
  }


}
