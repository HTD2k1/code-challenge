/**
* ITERATIVE APPROACH: loop from 1 to n and keep a running total.
* Time complexity: O(n) — we add numbers one by one.
* Space complexity: O(1) — only two variables (sum, i) are used.

* Reliable for large n, but slower than the formula.
*/

export const sum_to_n_a = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
* FORMULA APPROACH: direct math formula (Gauss) → n(n+1)/2.
* Time complexity: O(1) — just a single calculation.
* Space complexity: O(1) — no extra memory.

* This is the fastest and most efficient solution.
*/
export const sum_to_n_b = (n: number): number => {
  return (n * (n + 1)) / 2;
};

/**
 * RECURSIVE APPROACH: reduce problem size by 1 until reaching base case.
 * Time complexity: O(n) — same work as the loop.
 * Space complexity: O(n) — recursion adds one stack frame per call.
 * Works fine for small n, but unsafe for large n (risk of stack overflow).
 */
export const sum_to_n_c = (n: number): number => {
  return n === 1 ? 1 : n + sum_to_n_c(n - 1);
};

// Test
console.log(sum_to_n_a(50)); // 1275
console.log(sum_to_n_b(50)); // 1275
console.log(sum_to_n_c(50)); // 1275
