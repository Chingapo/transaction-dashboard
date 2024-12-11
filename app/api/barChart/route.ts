import { NextRequest, NextResponse } from 'next/server';

interface Transaction {
    itemId: number;
    price: number;
    dateOfSale: string;
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const month = parseInt(searchParams.get('month') || '13', 10);

        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/transactions`;
        const response = await fetch(firestoreUrl);

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Firebase error:', errorDetails);
            throw new Error(`Failed to fetch data from Firestore: ${errorDetails}`);
        }

        const data = await response.json();

        let transactions: Transaction[] = data.documents?.map((doc: any) => {
            const fields = doc.fields;
            return {
                itemId: fields.itemId?.integerValue || 0,
                price: fields.price?.doubleValue || fields.price?.integerValue || 0,
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

        const priceRanges: { [key: string]: number } = {};

        transactions.forEach((transaction: Transaction) => {
            const price = parseFloat(transaction.price.toString());
            if (!isNaN(price)) {
                const rangeStart = Math.floor(price / 100) * 100;
                const rangeEnd = rangeStart + 99;
                const rangeKey = `${rangeStart}-${rangeEnd}`;

                if (!priceRanges[rangeKey]) {
                    priceRanges[rangeKey] = 0;
                }
                priceRanges[rangeKey] += 1;
            }
        });

        const priceRangeData = Object.keys(priceRanges).map((key) => ({
            range: key,
            count: priceRanges[key],
        }));

        return NextResponse.json({ priceRanges: priceRangeData });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching price ranges:', error.message);
            return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json({ message: 'Internal Server Error', error: 'Unknown error' }, { status: 500 });
        }
    }
}
