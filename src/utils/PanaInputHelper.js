// helperFunctions.js

export const filterSinglePanaByRemainder = (remainder) => {
    return Array.from({ length: 900 }, (_, index) => index + 100)
      .filter(num => {
        const digits = num.toString().split('').map(Number);
        const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
        const isAscending = digits[2] === 0 
          ? digits[0] <= digits[1]
          : digits[0] <= digits[1] && digits[1] <= digits[2]; 
        const allDigitsUnique = new Set(digits).size === digits.length;
        return sumOfDigits % 10 === remainder && isAscending && allDigitsUnique;
      })
      .map(num => num.toString());
  };
  
  export const filterDoublePanaByRemainder = (remainder) => {
    return Array.from({ length: 900 }, (_, index) => index + 100)
      .filter(num => {
        const digits = num.toString().split('').map(Number);
        const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
        const isAscending = digits[2] === 0 
          ? digits[0] <= digits[1]
          : digits[0] <= digits[1] && digits[1] <= digits[2];
        const hasRepeatedDigit = new Set(digits).size !== digits.length;
        const allSameDigit = new Set(digits).size === 1; // Checks if all digits are the same
        return sumOfDigits % 10 === remainder && isAscending && hasRepeatedDigit && !allSameDigit;
      })
      .map(num => num.toString());
  };
  
  export const isTriplePana = (num) => {
    const firstDigit = Math.floor(num / 100);
    const secondDigit = Math.floor((num / 10) % 10);
    const thirdDigit = num % 10;
  
    return firstDigit === secondDigit && secondDigit === thirdDigit;
  };
  