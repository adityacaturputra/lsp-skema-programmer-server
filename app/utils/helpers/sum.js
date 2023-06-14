module.exports = (arr) => {
    let sum = 0;

    // iterate over each item in the array
    for (let i = 0; i < arr.length; i++ ) {
    sum += arr[i];
    }

    return sum;
}