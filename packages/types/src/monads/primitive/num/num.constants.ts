/**
 * @type {number}
 * @const
 * @inner
 * @private
 */
export const TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 * @private
 */
export const TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 * @private
 */
export const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 * @private
 */
export const TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 * @private
 */
export const TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

export const DEFAULT_NUM_RADIX = 10;
