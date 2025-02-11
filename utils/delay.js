/**
 * Set duration for {n} amount of time.
 *
 * @param {number} duration - delay duration in miliseconds
 * @returns {Promise}
 */
export default function (duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
