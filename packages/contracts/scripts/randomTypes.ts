function shuffle(arr: number[]) {
  const res = [];
  let random;

  while (arr.length > 0) {
    random = parseInt(String(Math.random() * arr.length));
    res.push(arr.splice(random, 1)[0]);
  }

  return res;
}

export function randomTypes() {
  const types: Record<number, number[]> = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  let arr: number[] = [];

  for (let i = 0; i < 750; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    const tokenId: number = arr.shift() as number;

    if (types[1].length < 2) {
      types[1].push(tokenId + 1);
    } else if (types[2].length < 15) {
      types[2].push(tokenId + 1);
    } else if (types[3].length < 80) {
      types[3].push(tokenId + 1);
    } else {
      types[4].push(tokenId + 1);
    }
  }

  for (let i = 750; i < 1210; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    const tokenId: number = arr.shift() as number;

    if (types[1].length < 3) {
      types[1].push(tokenId + 1);
    } else if (types[2].length < 24) {
      types[2].push(tokenId + 1);
    } else if (types[3].length < 120) {
      types[3].push(tokenId + 1);
    } else {
      types[4].push(tokenId + 1);
    }
  }

  for (let i = 1210; i < 2500; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    const tokenId: number = arr.shift() as number;

    if (types[1].length < 29) {
      types[1].push(tokenId + 1);
    } else if (types[2].length < 128) {
      types[2].push(tokenId + 1);
    } else if (types[3].length < 442) {
      types[3].push(tokenId + 1);
    } else {
      types[4].push(tokenId + 1);
    }
  }

  for (let i = 2500; i < 3000; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    const tokenId: number = arr.shift() as number;

    types[4].push(tokenId + 1);
  }

  for (let i = 3000; i < 5000; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    const tokenId: number = arr.shift() as number;

    if (types[1].length < 69) {
      types[1].push(tokenId + 1);
    } else if (types[2].length < 288) {
      types[2].push(tokenId + 1);
    } else if (types[3].length < 942) {
      types[3].push(tokenId + 1);
    } else {
      types[4].push(tokenId + 1);
    }
  }

  return types;
}
