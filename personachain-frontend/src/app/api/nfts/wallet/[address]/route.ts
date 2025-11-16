import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const walletAddress = params.address;

    // Validate wallet address
    if (!walletAddress || walletAddress.length < 32) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Query Firestore for all NFTs by this wallet
    const nftsRef = collection(db, 'mintedNFTs');
    const q = query(
      nftsRef,
      where('walletAddress', '==', walletAddress),
      orderBy('mintedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const nfts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return NextResponse.json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}
