import type { Signer } from '@ethersproject/abstract-signer';
import type { Asset, OrderKey, OrderType, SequenceOrderType } from './types';

import { defaultAbiCoder, ParamType } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { keccak256 } from '@ethersproject/keccak256';

import { randomHex } from './utils';

export const AssetTypeComponents = [
  {
    name: 'token',
    type: 'address'
  },
  {
    name: 'tokenId',
    type: 'uint256'
  },
  {
    name: 'assetType',
    type: 'uint8'
  }
];

export const OrderKeyComponents = [
  {
    name: 'owner',
    type: 'address'
  },
  {
    name: 'salt',
    type: 'uint256'
  },
  {
    components: AssetTypeComponents,
    name: 'sellAsset',
    type: 'tuple'
  },
  {
    components: AssetTypeComponents,
    name: 'buyAsset',
    type: 'tuple'
  }
];

export const OrderComponents = [
  {
    name: 'key',
    type: 'tuple',
    components: OrderKeyComponents
  },
  {
    name: 'selling',
    type: 'uint256'
  },
  {
    name: 'buying',
    type: 'uint256'
  }
];

export default class Order {
  public key: OrderKey;
  public selling: BigNumber;
  public buying: BigNumber;

  public static parse(_order: SequenceOrderType): Order {
    const owner = _order.key.owner;
    const sellAsset: Asset = {
      token: _order.key.sellAsset.token,
      tokenId: BigNumber.from(_order.key.sellAsset.tokenId),
      assetType: _order.key.sellAsset.assetType
    };
    const buyAsset: Asset = {
      token: _order.key.buyAsset.token,
      tokenId: BigNumber.from(_order.key.buyAsset.tokenId),
      assetType: _order.key.buyAsset.assetType
    };
    const selling: BigNumber = BigNumber.from(_order.selling);
    const buying: BigNumber = BigNumber.from(_order.buying);

    return new Order(owner, sellAsset, buyAsset, selling, buying, _order.key.salt);
  }

  constructor(
    owner: string,
    sellAsset: Asset,
    buyAsset: Asset,
    selling: BigNumber,
    buying: BigNumber,
    saltStr?: string
  ) {
    const salt = BigNumber.from(saltStr ?? randomHex(32));
    const key: OrderKey = {
      owner,
      salt,
      sellAsset,
      buyAsset
    };

    this.key = key;
    this.selling = selling;
    this.buying = buying;
  }

  public toJson(): OrderType {
    return {
      key: this.key,
      selling: this.selling,
      buying: this.buying
    };
  }

  public sequence(): SequenceOrderType {
    return {
      key: {
        salt: this.key.salt.toString(),
        owner: this.key.owner,
        sellAsset: {
          token: this.key.sellAsset.token,
          tokenId: this.key.sellAsset.tokenId.toString(),
          assetType: this.key.sellAsset.assetType
        },
        buyAsset: {
          token: this.key.buyAsset.token,
          tokenId: this.key.buyAsset.tokenId.toString(),
          assetType: this.key.buyAsset.assetType
        }
      },
      selling: this.selling.toString(),
      buying: this.buying.toString()
    };
  }

  public toKeccak256String(): string {
    const order = this.toJson();

    const orderParam = ParamType.fromObject({
      name: 'order',
      type: 'tuple',
      components: OrderComponents
    });

    return keccak256(defaultAbiCoder.encode([orderParam], [order])).slice(2);
  }

  public async sign(signer: Signer): Promise<string> {
    const message = this.toKeccak256String();

    const signature = await signer.signMessage(message);

    return signature;
  }
}
