import { NextRequest, NextResponse } from 'next/server';

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

interface CategoryData {
  category: string;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const month = parseInt(searchParams.get('month') || '13', 10);

    // Fetching all transactions from Firestore
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/transactions`;
    const response = await fetch(firestoreUrl);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Firebase error:', errorDetails);
      throw new Error(`Failed to fetch data from Firestore: ${errorDetails}`);
    }

    const data = await response.json();

    let transactions = data.documents?.map((doc: any) => {
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

    // If month = 13, return all transactions
    if (month !== 13) {
      transactions = transactions.filter((transaction: Transaction) => {
        const monthFromDate = transaction.dateOfSale.split('T')[0].split('-')[1];
        return monthFromDate === month.toString().padStart(2, '0');
      });
    }

    const categoryCounts: { [key: string]: number } = {};

    transactions.forEach((transaction: Transaction) => {
      if (transaction.category) {
        categoryCounts[transaction.category] = (categoryCounts[transaction.category] || 0) + 1;
      }
    });

    const categoriesData: CategoryData[] = Object.keys(categoryCounts).map((category) => ({
      category,
      count: categoryCounts[category],
    }));

    return NextResponse.json({ categories: categoriesData });

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
