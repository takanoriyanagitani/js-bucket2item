import { info2dataNew } from "./bucket2item.mjs"
import { response2json } from "./zcat2json2parsed.mjs"

/**
 * @import { IO } from "./io.mjs"
 */

/**
 * @import { SimpleRangeRequest } from "./rgreq.mjs"
 */

/**
 * @import {
 *   ItemInfoToRequest,
 *   ItemInfoToItemDataResponse,
 * } from "./bucket2item.mjs"
 */

/**
 * @typedef {object} ItemInfo
 * @property {string} ship_id
 * @property {string} container_id
 * @property {string} bucket_id
 * @property {string} item_id
 * @property {number} offset
 * @property {number} size
 */

/**
 * @param {ItemInfo} info
 * @returns {string}
 */
function info2url(info) {
  /** @type string */
  const sid = info.ship_id

  /** @type string */
  const cid = info.container_id

  /** @type string */
  const bid = info.bucket_id

  /** @type string */
  const lid = info.item_id

  return `scbi.d/data.d/${sid}/${cid}/${bid}.jsons.gz`
}

/**
 * @param {ItemInfo} info
 * @returns {SimpleRangeRequest}
 */
function _info2req(info) {
  return Object.freeze({
    url: info2url(info),
    start: info.offset,
    end: info.offset + info.size - 1,
  })
}

/** @type ItemInfoToRequest<ItemInfo> */
const info2req = _info2req

/** @type ItemInfo[] */
const ilist = [
  Object.freeze({
    ship_id: "cafef00d-dead-beaf-face-864299792458",
    container_id: "2025/05/01",
    bucket_id: "570145e0",
    item_id: "0",
    offset: 0,
    size: 93,
  }),
  Object.freeze({
    ship_id: "cafef00d-dead-beaf-face-864299792458",
    container_id: "2025/05/01",
    bucket_id: "570145e0",
    item_id: "1",
    offset: 93,
    size: 93,
  }),
]

/** @type ItemInfoToItemDataResponse<ItemInfo> */
const info2data = info2dataNew(info2req)

/** @type IO<Void> */
const main = () => {
  /** @type IO<Response>[] */
  const ires = ilist.map(info2data)

  /** @type Promise<Response>[] */
  const pares = ires.map((i) => i())

  /** @type Promise<Response[]> */
  const pres = Promise.all(pares)

  return pres
    .then((res) => {
      /** @type IO<object>[] */
      const parsed = res.map(response2json)

      /** @type Promise<object>[] */
      const paobj = parsed.map((i) => i())

      /** @type Promise<object[]> */
      const pobj = Promise.all(paobj)

      return pobj
    })
    .then((objects) => {
      /** @type object */
      const o0 = objects[0]

      /** @type object */
      const o1 = objects[1]

      /** @type HTMLElement? */
      const odiv = document.getElementById("rt")

      if (!odiv) return Promise.reject("div not found")

      const d0 = document.createElement("div")
      const d1 = document.createElement("div")

      d0.textContent = JSON.stringify(o0)
      d1.textContent = JSON.stringify(o1)

      odiv.append(d0)
      odiv.append(d1)

      return Promise.resolve()
    })
}

main()
  .catch(console.error)
