import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale';
import { CartService, SaleDetails } from '../../services/cart/cart.service';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  listOfSales: SaleDetails[] = [];

  constructor(private cartService: CartService, private eventService: EventService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(sales => {
      if (sales)
        this.sortSales(sales);
    });
  }

  // Crea un'array con le informazioni utili alla pagina
  sortSales(sales: SaleDetails[]): void {
    const salesMap = new Map<string, SaleDetails>();

    for (let sale of sales) {
      const dateObj = new Date(sale.event_date);
      sale.event_date = dateObj.toLocaleDateString('en-GB');
      sale.quantity = 1;
  
      // Create a unique key using event_name and ticket_type
      const key = `${sale.event_name}-${sale.ticket_type}`;
  
      // Check if a sale with the same event_name and ticket_type already exists
      if (salesMap.has(key)) {
        // If it exists, increment the quantity
        salesMap.get(key)!.quantity += sale.quantity;
      } else {
        // If it doesn't exist, add the sale to the map
        sale.quantity = 1; // Set the initial quantity to 1
        salesMap.set(key, sale);
      }
    }
    // Convert the map back to an array and assign it to listOfSales
    this.listOfSales = Array.from(salesMap.values());
  }
}
