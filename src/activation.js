const guestSelector = 'webview[data-sidebar-browser-frame="webview"]'

function mountGuests(ctx) {
  const panels = new Map()
  function attach(guest) {
    if (panels.has(guest) || !guest.isConnected) return
    const content = guest.closest('[aria-busy]')
    const toolbar = content?.parentElement?.querySelector(':scope > form')
    if (!content || !toolbar || !guest.closest('[data-sidebar-right-session]')) return
    panels.set(guest, installPanel(ctx, guest, toolbar, content))
  }
  function scan(node) {
    if (!(node instanceof Element)) return
    if (node.matches(guestSelector)) attach(node)
    else node.querySelectorAll(guestSelector).forEach(attach)
  }
  const observer = new MutationObserver(records => {
    for (const [guest, dispose] of panels) {
      if (!guest.isConnected) { dispose(); panels.delete(guest) }
    }
    for (const record of records) for (const node of record.addedNodes) scan(node)
  })
  scan(document.documentElement)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => { observer.disconnect(); panels.forEach(dispose => dispose()); panels.clear() }
}

function apply(ctx) {
  if (!window.dshDesktop?.browser) return
  // Register the owning session on every mounted composer, including split views.
  const seat = 'conversation.input.overlay'
  ctx.effect(() => ctx.slots.inject(seat, () => ctx.slots.register({
    name: seat, id: 'dsh-browser-annotations', inject: id => ({ ctx, owningSession: id })
  }, ComposerNotes)), 'browser annotations: composer')
  ctx.effect(() => {
    const sheet = document.createElement('style')
    sheet.textContent = styles
    document.head.append(sheet)
    const dispose = mountGuests(ctx)
    return () => { dispose(); sheet.remove() }
  }, 'browser annotations: browser toolbar')
}
