export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
}

export const products: Product[] = [
  {
    id: 'prod_SlYQfKE5ph0N4a',
    priceId: 'price_1Rq1JQGy0L2Ot2BS6Zru9leS',
    name: 'Renda AI Anual',
    description: 'Plano anual com desconto especial',
    mode: 'subscription',
    price: 'R$ 383,04'
  },
  {
    id: 'prod_Sh10D26PVfLJc8',
    priceId: 'price_1RlcysGy0L2Ot2BSDJKkKpDF',
    name: 'Renda AI',
    description: 'Renda AI - Mensal',
    mode: 'subscription',
    price: 'R$ 29,90'
  }
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};