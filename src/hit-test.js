// Executed inside the guest solely to read the visible target under a point.
// All controls, screenshots and note text stay in the DSH renderer.
function pageTarget(nx, ny) {
  const vw = window.innerWidth, vh = window.innerHeight
  let doc = document, x = nx * vw, y = ny * vh
  let ox = 0, oy = 0, sx = 1, sy = 1
  let clip = { left: 0, top: 0, right: vw, bottom: vh }
  const frames = []
  for (let depth = 0; depth < 16; depth++) {
    let el = doc.elementFromPoint(x, y)
    if (!el) return null
    for (let i = 0; i < 16 && el.shadowRoot; i++) {
      const next = el.shadowRoot.elementFromPoint?.(x, y)
      if (!next || next === el) break
      el = next
    }
    const r = el.getBoundingClientRect()
    const tag = el.localName
    const path = []
    for (let node = el; node && path.length < 10; node = node.parentElement) {
      if (node.id) { path.unshift('#' + CSS.escape(node.id)); break }
      let n = 1
      for (let sib = node.previousElementSibling; sib; sib = sib.previousElementSibling) {
        if (sib.localName === node.localName) n++
      }
      path.unshift(node.localName + ':nth-of-type(' + n + ')')
    }
    const rect = {
      left: Math.max(clip.left, ox + r.left * sx), top: Math.max(clip.top, oy + r.top * sy),
      right: Math.min(clip.right, ox + r.right * sx), bottom: Math.min(clip.bottom, oy + r.bottom * sy)
    }
    const child = tag === 'iframe' ? el.contentDocument : null
    if (child?.documentElement && el.offsetWidth && el.offsetHeight) {
      const rx = r.width / el.offsetWidth, ry = r.height / el.offsetHeight
      const ix = r.left + el.clientLeft * rx, iy = r.top + el.clientTop * ry
      if (x >= ix && y >= iy && x < ix + el.clientWidth*rx && y < iy + el.clientHeight*ry) {
        frames.push(path.join(' > '))
        ox += sx * ix; oy += sy * iy; sx *= rx; sy *= ry
        x = (x - ix) / rx; y = (y - iy) / ry
        clip = rect; doc = child
        continue
      }
    }
    return { tag, path: [...frames, path.join(' > ')].join(' / ').slice(0,700),
      rect: { left: rect.left/vw, right: rect.right/vw, top: rect.top/vh, bottom: rect.bottom/vh } }
  }
  return null
}

async function targetAt(guest, point) {
  const args = [point.x, point.y].map(v => Number.isFinite(v) ? clamp(v, 0, 0.999999) : 0)
  const result = await guest.executeJavaScript('(' + pageTarget.toString() + ')(...'+JSON.stringify(args)+')')
  const r = result?.rect
  if (!r || ![r.left,r.top,r.right,r.bottom].every(v => Number.isFinite(v) && v >= 0 && v <= 1)
    || r.right <= r.left || r.bottom <= r.top || typeof result.tag !== 'string') return null
  return { rect: r, tag: result.tag.slice(0,60), path: String(result.path).slice(0,700) }
}
