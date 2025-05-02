import { bind, of } from "./io.mjs"

/**
 * @import { IO } from "./io.mjs"
 */

/**
 * @param {ReadableStream} rstrm The readable stream to be decompressed.
 * @returns {IO<string>}
 */
export function readable2text(rstrm) {
  return () => {
    /** @type DecompressionStream */
    const dec = new DecompressionStream("gzip")

    return Promise.resolve()
      .then((_) => rstrm.pipeThrough(dec))
      .then((decStream) => {
        /** @type Response */
        const res = new Response(decStream)
        return Promise.resolve()
          .then((_) => res.text())
      })
  }
}

/**
 * @param {ReadableStream} rstrm The readable stream to be decompressed.
 * @returns {IO<object>}
 */
export function readable2jsonObject(rstrm) {
  return () => {
    /** @type DecompressionStream */
    const dec = new DecompressionStream("gzip")

    return Promise.resolve()
      .then((_) => rstrm.pipeThrough(dec))
      .then((decStream) => {
        /** @type Response */
        const res = new Response(decStream)
        return Promise.resolve()
          .then((_) => res.json())
      })
  }
}

/**
 * @param {Response} res The response object to be decompressed.
 * @returns {IO<string>}
 */
export function response2text(res) {
  return () => {
    return Promise.resolve()
      .then((_) => {
        /** @type ReadableStream? */
        const orstrm = res.body

        /** @type IO<string>? */
        const oitext = orstrm ? readable2text(orstrm) : null

        /** @type IO<string> */
        const itext = oitext ?? of("")

        return itext()
      })
  }
}

/**
 * @param {Response} res The response object to be decompressed.
 * @returns {IO<object>}
 */
export function response2json(res) {
  return () => {
    return Promise.resolve()
      .then((_) => {
        /** @type ReadableStream? */
        const orstrm = res.body

        /** @type IO<object>? */
        const oiobj = orstrm ? readable2jsonObject(orstrm) : null

        /** @type IO<object> */
        const iobj = oiobj ?? of({})

        return iobj()
      })
  }
}

/**
 * @param {string} url
 * @returns {IO<Response>}
 */
export function url2response(url) {
  return () => {
    return Promise.resolve()
      .then((_) => fetch(url))
  }
}

/**
 * @param {string} url The url of the gzipped json.
 * @returns {IO<object>}
 */
export function url2zcat2jsonObject(url) {
  /** @type IO<Response> */
  const ires = url2response(url)
  return bind(ires, response2json)
}
