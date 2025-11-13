'use client';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
  where,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Interface untuk NFT Gallery
export interface NFTGalleryData {
  walletAddress: string;
  personality: string;
  nickname: string;
  txId: string;
  nftImage: string;
  mintedAt: string;
  network: string;
  createdAt?: any;
  id?: string;
}

// ✅ SAVE NFT to Gallery
export const saveNFTToGallery = async (nftData: NFTGalleryData) => {
  try {
    const docRef = await addDoc(collection(db, 'nft_gallery'), {
      walletAddress: nftData.walletAddress,
      personality: nftData.personality,
      nickname: nftData.nickname,
      txId: nftData.txId,
      nftImage: nftData.nftImage,
      mintedAt: nftData.mintedAt,
      network: nftData.network,
      createdAt: new Date(),
    });
    console.log('✅ NFT saved to gallery:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving NFT to gallery:', error);
    throw error;
  }
};

// ✅ GET All NFTs (Latest First)
export const getNFTGallery = async (limitNumber: number = 50) => {
  try {
    const q = query(
      collection(db, 'nft_gallery'),
      orderBy('createdAt', 'desc'),
      limit(limitNumber)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (NFTGalleryData & { id: string })[];
  } catch (error) {
    console.error('❌ Error fetching NFT gallery:', error);
    return [];
  }
};

// ✅ GET NFTs by Personality Type
export const getNFTsByPersonality = async (
  personality: string,
  limitNumber: number = 12
) => {
  try {
    const q = query(
      collection(db, 'nft_gallery'),
      where('personality', '==', personality),
      orderBy('createdAt', 'desc'),
      limit(limitNumber)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (NFTGalleryData & { id: string })[];
  } catch (error) {
    console.error('❌ Error fetching NFTs by personality:', error);
    return [];
  }
};

// ✅ GET NFTs by Wallet
export const getNFTsByWallet = async (walletAddress: string) => {
  try {
    const q = query(
      collection(db, 'nft_gallery'),
      where('walletAddress', '==', walletAddress),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (NFTGalleryData & { id: string })[];
  } catch (error) {
    console.error('❌ Error fetching user NFTs:', error);
    return [];
  }
};

// ✅ GET Statistics
export const getGalleryStats = async () => {
  try {
    const q = query(collection(db, 'nft_gallery'));
    const snapshot = await getDocs(q);
    const allNFTs = snapshot.docs.map(doc => doc.data() as NFTGalleryData);

    const stats = {
      totalNFTs: allNFTs.length,
      personalityCount: {} as Record<string, number>,
    };

    allNFTs.forEach(nft => {
      if (nft.personality) {
        stats.personalityCount[nft.personality] =
          (stats.personalityCount[nft.personality] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return { totalNFTs: 0, personalityCount: {} };
  }
};
