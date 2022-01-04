# @horse-racing/core

## ERC20
```typescript
  // Can only be called method when isReady
  isReady(): Promise<ERC20>

  totalSupply(): Promise<BigNumber>

  balanceOf(account: string): Promise<BigNumber>

  transfer(recipient: string, amount: BigNumber): Promise<TransactionResponse>

  allowance(owner: string, spender: string): Promise<BigNumber>

  approve(spender: string, amount: BigNumber): Promise<TransactionResponse>

  transferFrom(sender: string, recipient: string, amount: BigNumber): Promise<TransactionResponse>

  // get balance of account, format to human
  displayedBalanceOf(account: string): Promise<string>
  // get totalSupply, format to human
  displayedTotalSupply(): Promise<string>
```

## ERC721
```typescript
  // Can only be called method when isReady
  isReady(): Promise<ERC20>

  tokenURI(tokenId: BigNumber): Promise<string>

  balanceOf(owner: string): Promise<BigNumber>

  ownerOf(tokenId: BigNumber): Promise<string>

  getApproved(tokenId: BigNumber): Promise<boolean>

  approve(to: string, tokenId: BigNumber): Promise<TransactionResponse>

  isApprovedForAll(owner: string, operator: string): Promise<boolean>

  setApprovalForAll(operator: string, approved: boolean): Promise<TransactionResponse>

  transferFrom(from: string, to: string, tokenId: BigNumber): Promise<TransactionResponse>

  safeTransferFrom(from: string, to: string, tokenId: BigNumber): Promise<TransactionResponse>
```

## BlindBox

BlindBox is extends `ERC721`

```typescript

  // buy BlindBox Nfts
  // amount, buy number
  buy(amount: BigNumber | number | string): Promise<TransactionResponse>

  // This Nfts price
  price(): Promise<BigNumber>
```
