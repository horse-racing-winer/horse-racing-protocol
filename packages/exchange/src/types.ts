import type { BigNumber } from '@ethersproject/bignumber';

export enum AssetType {
  ETH = 0,
  ERC20 = 1,
  ERC1155 = 2,
  ERC721 = 3
}

export type Asset = {
  token: string;
  tokenId: BigNumber;
  assetType: AssetType;
};

export type OrderKey = {
  owner: string;
  salt: BigNumber;
  sellAsset: Asset;
  buyAsset: Asset;
};

export interface OrderType {
  key: OrderKey;
  selling: BigNumber;
  buying: BigNumber;
}

export interface SequenceOrderType {
  key: {
    salt: string;
    owner: string;
    sellAsset: {
      token: string;
      tokenId: string;
      assetType: AssetType;
    };
    buyAsset: {
      token: string;
      tokenId: string;
      assetType: AssetType;
    };
  };
  selling: string;
  buying: string;
}

export interface FeeType {
  recipient: string;
  value: number;
}
