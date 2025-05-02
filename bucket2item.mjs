import { handleSimpleRequest } from "./rgreq.mjs"

import { bind, lift } from "./io.mjs"

/**
 * @import { IO } from "./io.mjs"
 */

/**
 * @import { SimpleRangeRequest, SimpleRangeResponse } from "./rgreq.mjs"
 */

/**
 * @template I
 * @typedef {function(I): IO<Response>} ItemInfoToItemDataResponse<I>
 */

/**
 * @template I
 * @typedef {function(I): SimpleRangeRequest} ItemInfoToRequest<I>
 */

/**
 * Validates the response.
 * @param {SimpleRangeResponse} sres
 * @param {number} offset The expected offset.
 * @returns {Promise<Response>}
 */
function sres2res(sres, offset) {
  /** @type number */
  const start = sres.start

  /** @type boolean */
  const ok = start == offset

  if (!ok) {
    return Promise.reject(`unexpected offset: ${start}`)
  }

  /** @type Response */
  const res = sres.response

  return Promise.resolve(res)
}

/**
 * @template I
 * @param {ItemInfoToRequest<I>} info2req
 * @returns {ItemInfoToItemDataResponse<I>}
 */
export function info2dataNew(info2req) {
  return (itemInfo) => {
    return () => {
      /** @type SimpleRangeRequest */
      const sreq = info2req(itemInfo)

      /** @type number */
      const offset = sreq.start

      /** @type IO<SimpleRangeResponse> */
      const isres = handleSimpleRequest(sreq)

      /** @type IO<Response> */
      const ires = bind(
        isres,
        lift((sres) => {
          return sres2res(sres, offset)
        }),
      )

      return ires()
    }
  }
}
