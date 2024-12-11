import { NextRequest, NextResponse } from 'next/server';

interface Stats {
  totalSale: number;
  totalItemsSold: number;
  totalItemsNotSold: number;
}

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

interface FirestoreDocument {
    fields: {
      itemId: { integerValue: number };
      title: { stringValue: string };
      price: { doubleValue?: number; integerValue?: number };
      description: { stringValue: string };
      category: { stringValue: string };
      image: { stringValue: string };
      sold: { booleanValue: boolean };
      dateOfSale: { stringValue: string };
    };
  }

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const month = parseInt(searchParams.get('month') || '13', 10);

        // Fetching all transactions
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/transactions`;
        const response = await fetch(firestoreUrl);

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Firebase error:', errorDetails);
            throw new Error(`Failed to fetch data from Firestore: ${errorDetails}`);
        }

        const data = await response.json();

        let transactions = data.documents?.map((doc: FirestoreDocument) => {
            const fields = doc.fields;
            return {
                itemId: fields.itemId?.integerValue || 0,
                title: fields.title?.stringValue || '',
                price: fields.price?.doubleValue || fields.price?.integerValue || 0,
                description: fields.description?.stringValue || '',
                category: fields.category?.stringValue || '',
                image: fields.image?.stringValue || '',
                sold: fields.sold?.booleanValue || false,
                dateOfSale: fields.dateOfSale?.stringValue || '',
            };
        }) || [];

        // if month = 13, return all transactions
        if (month !== 13) {
            transactions = transactions.filter((transaction: Transaction) => {
                const monthFromDate = transaction.dateOfSale.split('T')[0].split('-')[1];
                return monthFromDate === month.toString().padStart(2, '0');
            });
        }

        let totalSale = 0;
        let totalItemsSold = 0;
        let totalItemsNotSold = 0;

        transactions.forEach((transaction: Transaction) => {
            if (transaction.sold) {
                const price = parseFloat(transaction.price.toString());
                if (!isNaN(price)) {
                    totalSale += price;
                }
                totalItemsSold += 1;
            } else {
                totalItemsNotSold += 1;
            }
        });
        

        const stats: Stats = {
            totalSale,
            totalItemsSold,
            totalItemsNotSold
        };

        return NextResponse.json(stats);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching statistics:', error.message);
            return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json({ message: 'Internal Server Error', error: 'Unknown error' }, { status: 500 });
        }
    }
}
