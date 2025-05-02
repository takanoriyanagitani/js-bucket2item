/**
 * @import { IO } from "./io.mjs"
 */

/**
 * @typedef {object} SimpleRangeRequest
 * @property {string} url
 * @property {number} start
 * @property {number} end
 */

/**
 * @typedef {object} SimpleRangeResponse
 * @property {Response} response
 * @property {number} start
 * @property {number} end
 */

/**
 * @param {SimpleRangeRequest} req
 * @returns {IO<SimpleRangeResponse>}
 */
export function handleSimpleRequest(req) {
  return () => {
    /** @type string */
    const url = req.url

    /** @type number */
    const start = req.start

    /** @type number */
    const end = req.end

    return Promise.resolve()
      .then((_) =>
        fetch(
          url,
          Object.freeze({
            headers: {
              Range: `bytes=${start}-${end}`,
            },
          }),
        )
      )
      .then((res) => {
        /** @type Headers */
        const headers = res.headers

        /** @type string */
        const sclen = headers.get("Content-Length") ?? "0"

        /** @type number */
        const clen = Number.parseInt(sclen)

        /** @type number */
        const status = res.status

        if (206 != status) {
          return Object.freeze({
            response: res,
            start: 0,
            end: clen - 1,
          })
        }

        return Object.freeze({
          response: res,
          start,
          end,
        })
      })
  }
}

/**
 * Creates SimpleRangeRequest.
 * @param {string} url
 * @param {number} offset
 * @param {number} size
 */
export function offset2request(url, offset, size) {
  return Object.freeze({
    url: url,
    start: offset,
    end: offset + size - 1,
  })
}
