const arr1 = [53, 46, 43, 45, 45, 37, 31, 22, 23, 20, 20, 20, 17, 22, 23, 28, 29, 30, 30, 28, 26, 34, 37, 42];

const func = (arr) => {
    let sum = 0;

    arr.forEach(item => sum += item);

    console.log('sum', sum);

    return {
        price: sum/arr.length,
        dollars: arr.length * 300
    }
}

const r = func(arr1);

console.log(r);