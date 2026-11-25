function imageFile(canvas, name) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob) resolve(new File([blob], name, { type: 'image/png' }))
    else reject(new Error('图片编码失败，请重试。'))
  }, 'image/png'))
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

// Rectangles are normalized against the frozen image. UI zoom, DPI and
// panel resizing do not change their meaning.
async function makePair(image, note, number) {
  const w = image.naturalWidth
  const h = image.naturalHeight
  const { left, top, right, bottom } = note.rect
  const x = Math.floor(left * w)
  const y = Math.floor(top * h)
  const width = Math.ceil(right * w) - x
  const height = Math.ceil(bottom * h) - y
  const crop = makeCanvas(width, height)
  crop.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height)
  const full = makeCanvas(w, h)
  const pen = full.getContext('2d')
  pen.drawImage(image, 0, 0)
  // Outline the selection in the context image while keeping the crop clean.
  pen.lineWidth = Math.max(2, Math.round(Math.min(w, h) / 300))
  pen.strokeStyle = '#1478ef'
  pen.strokeRect(x, y, width, height)
  return Promise.all([
    imageFile(crop, '注释-' + number + '-选区.png'),
    imageFile(full, '注释-' + number + '-可视区.png')
  ])
}

function composerFor(ctx, guest) {
  const id = guest.closest('[data-sidebar-right-session]')?.dataset.sidebarRightSession
  const binding = id && ctx.sessions.binding(id)
  const marker = id && [...document.querySelectorAll('[data-annotation-composer]')]
    .find(el => el.dataset.annotationComposer === id &&
      el.closest('[data-composer-card]')?.getClientRects().length &&
      !el.closest('[inert], [aria-hidden="true"]'))
  const card = marker && marker.closest('[data-composer-card]')
  const picker = card?.querySelector('input[type=file][multiple]')
  if (!binding || !picker || picker.disabled) throw new Error('当前对话暂时不能接收图片。请确认输入框可用后重试。')
  return { binding, picker, input: ctx.conversation.input.for(binding.ctx) }
}

const notePrefix = 'dsh-browser-note:'
function noteKey(quote) {
  return quote.summary?.detail?.startsWith(notePrefix) ? quote.summary.detail.slice(notePrefix.length) : undefined
}

function makeQuote(note) {
  const where = [note.url, note.path].filter(Boolean).join('\n')
  return {
    text: '网页注释 · ' + note.tag + '\n页面定位信息（来自网页）\n' + where + '\n\n用户注释\n' + note.text,
    summary: { label: '网页注释', title: note.tag, detail: notePrefix + note.key, body: note.text }
  }
}

// Rebuild only the changed semantic spans. References and all other quotes
// retain their text and offsets even when several notes are deleted together.
function writeNotes(input, replacements, appended) {
  if (input.state.getSnapshot().phase !== 'plain') throw new Error('请稍候，输入框正在处理消息。')
  const draft = input.draftSnapshot
  const spans = [
    ...draft.references.map(value => ({ value, reference: true })),
    ...(draft.quotes || []).map(value => ({ value, reference: false }))
  ].sort((a,b) => a.value.offset - b.value.offset)
  const next = { ...draft, text: '', references: [], quotes: [] }
  let cursor = 0
  for (const { value, reference } of spans) {
    next.text += draft.text.slice(cursor, value.offset)
    cursor = value.offset + value.length
    const key = reference ? undefined : noteKey(value)
    const item = key && replacements.has(key) ? replacements.get(key) : value
    if (!item) continue
    const spelling = reference ? item.clipboardText : formatQuoteText(item.text)
    const updated = { ...item, offset: next.text.length, length: spelling.length }
    if (reference) next.references.push(updated)
    else next.quotes.push(updated)
    next.text += spelling
  }
  next.text += draft.text.slice(cursor)
  for (const item of appended) {
    const spelling = formatQuoteText(item.text)
    next.quotes.push({ ...item, offset: next.text.length, length: spelling.length })
    next.text += spelling
  }
  input.setDraft(next)
  input.persistCurrentDraft()
}

function relatedFiles(ctx, input, keys) {
  const drafts = ctx.conversation.resolveDraftAttachments(input.state.getSnapshot().attachmentIds)
  return drafts.filter(item => keys.some(key => item.file.name === '注释-' + key + '-选区.png' ||
    item.file.name === '注释-' + key + '-可视区.png'))
}

function releaseFiles(ctx, input, ids) {
  for (const id of ids) if (input.removeAttachment(id)) ctx.conversation.releaseDraftAttachment(id)
}

function putInComposer(ctx, guest, binding, files, quote) {
  const { input, picker, binding: current } = composerFor(ctx, guest)
  if (binding !== current) throw new Error('当前会话已变化，请重试。')
  const before = input.state.getSnapshot()
  if (before.phase !== 'plain') throw new Error('请先让输入框返回普通消息模式。')
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  picker.files = transfer.files
  picker.dispatchEvent(new Event('change', { bubbles: true }))
  const added = input.state.getSnapshot().attachmentIds.filter(id => !before.attachmentIds.includes(id))
  try {
    if (added.length !== files.length) throw new Error('当前输入框未接收全部截图，请检查图片数量或大小限制。')
    writeNotes(input, new Map(), [quote])
  } catch (error) {
    releaseFiles(ctx, input, added)
    throw error
  }
}
