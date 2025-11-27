
export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
}

export interface OfferItem extends Product {}
