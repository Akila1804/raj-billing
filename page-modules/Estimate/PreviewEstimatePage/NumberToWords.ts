// Function to convert number to words
export const numberToWords = (num: number): string => {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const convertChunk = (n: number): string => {
    const hundred = Math.floor(n / 100);
    let ten = n % 100;
    let result = "";

    if (hundred > 0) {
      result += ones[hundred] + " hundred ";
    }

    if (ten >= 20) {
      result += tens[Math.floor(ten / 10)] + " ";
      ten = ten % 10;
    } else if (ten >= 10) {
      result += teens[ten - 10] + " ";
      return result.trim();
    }

    if (ten > 0) {
      result += ones[ten] + " ";
    }

    return result.trim();
  };

  if (num === 0) return "zero";

  let result = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore > 0) result += convertChunk(crore) + " crore ";
  if (lakh > 0) result += convertChunk(lakh) + " lakh ";
  if (thousand > 0) result += convertChunk(thousand) + " thousand ";
  if (num > 0) result += convertChunk(num);

  return result.trim() + " rupees only";
};
