import admin from '@/app/firebaseAdmin';
import { NextResponse } from 'next/server';

interface Transaction {
  itemId: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}
interface ProductTransaction {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}

export async function GET() {
  try {
    const db = admin.firestore();
    const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = await response.json();

    const batch = db.batch();
    data.forEach((item: ProductTransaction) => {
      const transactionData: Transaction = {
        itemId: item.id, // rename field to itemId as it clashes with firebase reserved field
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        sold: item.sold,
        dateOfSale: item.dateOfSale,
      };

      const docRef = db.collection('transactions').doc(transactionData.itemId.toString());
      batch.set(docRef, transactionData);
    });

    await batch.commit();
    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error seeding database:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'Error seeding database' }, { status: 500 });
    }
  }
}
