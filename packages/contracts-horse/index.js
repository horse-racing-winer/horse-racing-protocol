function shuffle(arr) {
  const res = [];
  let random;

  while (arr.length > 0) {
    random = parseInt(Math.random() * arr.length);
    res.push(arr.splice(random, 1)[0]);
  }

  return res;
}

function main() {
  const types = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  let arr = [];

  for (let i = 0; i < 2500; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    if (types[1].length < 10) {
      types[1].push(arr.shift() + 1);
    } else if (types[2].length < 80) {
      types[2].push(arr.shift() + 1);
    } else if (types[3].length < 410) {
      types[3].push(arr.shift() + 1);
    } else {
      types[4].push(arr.shift() + 1);
    }
  }

  for (let i = 2500; i < 3000; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    arr = shuffle(arr);

    if (types[1].length < 30) {
      types[1].push(arr.shift() + 1);
    } else if (types[2].length < 160) {
      types[2].push(arr.shift() + 1);
    } else if (types[3].length < 610) {
      types[3].push(arr.shift() + 1);
    } else {
      types[4].push(arr.shift() + 1);
    }
  }

  console.log(types[1].length);
  console.log(types[1]);
  console.log(types[2].length);
  console.log(types[2]);
  console.log(types[3].length);
  console.log(types[4].length);
}

main();
