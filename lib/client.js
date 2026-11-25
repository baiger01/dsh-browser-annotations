window.__ModuleLoader__.load({
  id: "dsh-browser-annotations",
  factory(require) {
    const React = require("react")
    const { formatQuoteText } = require("@deepseek-ai/dsh-client-ui-primitives")
    const styles = ".dsba-toggle {\n  flex: none; height: 27px; padding: 0 9px; border: 0; border-radius: 7px;\n  color: var(--dsw-alias-label-primary,#26282a); background: var(--dsw-alias-bg-layer-1,#f3f4f5);\n  font: 12px/1.4 system-ui,sans-serif; cursor: pointer;\n}\n.dsba-toggle:hover,.dsba-toggle[aria-pressed=true] { background: var(--dsw-alias-interactive-bg-hover,#e6e8ea); }\n.dsba-strip { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; font: 12px/1.35 system-ui,sans-serif; }\nform:has(> .dsba-strip) > :not(.dsba-strip,.dsba-toggle) { display: none; }\n.dsba-status { flex: 1; }\n.dsba-overlay {\n  position: absolute; inset: 0; z-index: 5; outline: none; display: grid; place-items: center; overflow: hidden;\n  font: 12px/1.45 system-ui,sans-serif; color: var(--dsw-alias-label-primary,#28292b); background: transparent;\n}\n.dsba-frozen { background: var(--dsw-alias-bg-layer-1,#f1f2f3); }\n.dsba-stage { position: relative; width: 100%; height: 100%; overflow: hidden; touch-action: none; user-select: none; }\n.dsba-stage > img { display: block; width: 100%; height: 100%; pointer-events: none; }\n.dsba-region {\n  position: absolute; z-index: 1; box-sizing: border-box; border: 1.5px solid #7298c4;\n  background: rgb(103 149 202 / 5%); pointer-events: none;\n}\n.dsba-element-label {\n  position: absolute; left: -1px; padding: 1px 5px; border-radius: 4px;\n  background: #556a81; color: #fff; font: 11px/1.5 ui-monospace,Consolas,monospace;\n}\n.dsba-frozen .dsba-element-label { display: none; }\n\n.dsba-editor {\n  --paper: var(--dsw-alias-bg-base,#fff);\n  --ink: var(--dsw-alias-label-primary,#242527);\n  --hairline: color-mix(in srgb,var(--ink) 13%,transparent);\n  --glass: color-mix(in srgb,var(--paper) 78%,transparent);\n  position: absolute; z-index: 2; box-sizing: border-box;\n  display: grid; grid-template-columns: 28px minmax(0,1fr) 28px; align-items: center; gap: 7px;\n  width: min(294px,calc(100% - 8px)); min-height: 44px; padding: 6px 8px;\n  color: var(--ink); background: var(--glass); border: 1px solid var(--hairline); border-radius: 23px; corner-shape: round;\n  backdrop-filter: blur(18px) saturate(80%);\n  box-shadow: inset 0 1px 0 color-mix(in srgb,var(--paper) 65%,transparent),0 2px 8px #181c2210,0 5px 20px #181c220c;\n}\n.dsba-editor:focus-within { border-color: color-mix(in srgb,var(--ink) 22%,transparent); }\n.dsba-editor .dsba-field,.dsba-editor .dsba-field:focus,.dsba-editor .dsba-field:focus-visible {\n  box-sizing: border-box; display: block; width: 100%; min-width: 0;\n  field-sizing: content; min-height: 20px; max-height: min(96px,18vh); overflow-y: auto; resize: none;\n  border: 0; outline: none !important; box-shadow: none; border-radius: 0; padding: 0;\n  background: transparent; color: inherit; caret-color: currentColor; font: 13px/20px system-ui,sans-serif;\n}\n.dsba-field::placeholder { color: color-mix(in srgb,var(--ink) 47%,var(--paper)); opacity: 1; }\n.dsba-options { position: static; }\n.dsba-options-trigger,.dsba-confirm {\n  box-sizing: border-box; display: grid; place-items: center; width: 28px; height: 28px;\n  margin: 0; padding: 0; border: 0; border-radius: 50%; corner-shape: round; cursor: pointer;\n}\n.dsba-editor svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }\n.dsba-options-trigger { list-style: none; color: color-mix(in srgb,var(--ink) 71%,var(--paper)); background: transparent; }\n.dsba-options-trigger::-webkit-details-marker { display: none; }\n.dsba-options-trigger:hover,.dsba-options[open] > summary { background: color-mix(in srgb,var(--ink) 7%,transparent); }\n.dsba-confirm { background: color-mix(in srgb,var(--ink) 88%,var(--paper)); color: var(--paper); }\n.dsba-confirm:hover:enabled { background: var(--ink); }\n.dsba-confirm:disabled { background: color-mix(in srgb,var(--ink) 37%,var(--paper)); cursor: default; }\n.dsba-options-trigger:focus-visible,.dsba-confirm:focus-visible,.dsba-options-list button:focus-visible {\n  outline: 1.5px solid currentColor; outline-offset: 2px;\n}\n.dsba-options-list {\n  position: absolute; left: 0; top: calc(100% + 4px); box-sizing: border-box;\n  width: min(142px,100%); max-height: var(--dsba-menu-room,150px); overflow-y: auto; padding: 4px;\n  border: 1px solid var(--hairline); border-radius: 12px; background: color-mix(in srgb,var(--paper) 96%,transparent);\n  box-shadow: 0 4px 16px #171d251a;\n}\n.dsba-editor[data-menu-side=above] .dsba-options-list { top: auto; bottom: calc(100% + 4px); }\n.dsba-options-list button {\n  display: block; width: 100%; padding: 6px 10px; border: 0; border-radius: 7px;\n  background: transparent; color: inherit; font: 12px/1.5 system-ui,sans-serif; text-align: left; cursor: pointer;\n}\n.dsba-options-list button:hover:enabled { background: color-mix(in srgb,var(--ink) 7%,transparent); }\n.dsba-options-list button:disabled { opacity: .46; cursor: default; }\n.dsba-note code { display:inline-block; padding:1px 5px; color:var(--dsw-alias-label-secondary,#48505b);\n  font:11px/1.5 ui-monospace,Consolas,monospace; border:1px solid var(--dsw-alias-border-l2,#e2e4e7); border-radius:4px; background:var(--dsw-alias-bg-layer-1,#f3f4f5); }\n[data-dsba-native] { display:none !important; }\n[data-composer-card]:has(.dsba-tray) { padding-top:34px; }\n[data-composer-overlay]:has(.dsba-tray) { z-index:4; }\n.dsba-tray { position:relative; margin:8px 12px 0; width:max-content; max-width:calc(100% - 24px);\n  color:var(--dsw-alias-label-primary,#222); font:13px/1.45 system-ui,sans-serif; }\n.dsba-pill { display:inline-flex; align-items:center; border:1px solid var(--dsw-alias-border-l2,#dedfe3);\n  background:var(--dsw-alias-bg-base,#fff); border-radius:8px; padding:2px 3px; }\n.dsba-pill button,.dsba-icon { display:inline-flex; align-items:center; justify-content:center; gap:5px;\n  border:0; border-radius:5px; background:transparent; color:inherit; padding:2px 4px; cursor:pointer; font:inherit; }\n.dsba-pill .dsba-icon { background:var(--dsw-alias-label-primary,#222); color:var(--dsw-alias-bg-base,#fff); border-radius:50%; padding:0; width:16px; height:16px; }\n.dsba-icon:hover,.dsba-pill button:hover { opacity:.7; }\n.dsba-popover { position:absolute; bottom:calc(100% + 6px); left:0; width:min(382px,var(--dsba-card-width,320px));\n  max-height:min(45vh,340px); overflow:auto; border:1px solid var(--dsw-alias-border-l2,#dedfe3);\n  background:var(--dsw-alias-bg-base,#fff); border-radius:12px; box-shadow:0 3px 13px #151b2520; }\n.dsba-note { padding:10px 13px; }\n.dsba-note+.dsba-note { border-top:1px solid var(--dsw-alias-border-l2,#dedfe3); }\n.dsba-note-top { display:flex; align-items:center; gap:6px; }\n.dsba-thumb { width:30px; height:22px; object-fit:contain; border:1px solid var(--dsw-alias-border-l2,#dedfe3); border-radius:5px; }\n.dsba-spacer { flex:1; }\n.dsba-note p { margin:8px 0 2px; white-space:pre-wrap; overflow-wrap:anywhere; }\n.dsba-edit-note { padding-top:7px; text-align:right; }\n.dsba-edit-note textarea { box-sizing:border-box; width:100%; color:inherit; background:transparent; border:1px solid var(--dsw-alias-border-l2,#dee0e3); border-radius:5px; font:inherit; }\n.dsba-edit-note button { margin:4px 0 0 6px; background:transparent; border:0; color:inherit; font:inherit; cursor:pointer; }\n\n"

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

    const h = React.createElement

    function annotationIcon(kind) {
      const paths = {
        note: 'M4 3.5h12v9H9l-4 3v-3H4z M7 7h6 M7 9.5h4',
        edit: 'm4 12-.6 3.5 3.5-.6 8-8-2.9-2.9z M11 6l3 3',
        delete: 'M3.5 5.5h12 M7 5V3.5h5V5 M5.5 6l.7 9h6.6l.7-9 M8 8v5 M11 8v5',
        close: 'm5.5 5.5 8 8m0-8-8 8'
      }
      return h('svg',{width:16,height:16,viewBox:'0 0 19 19',fill:'none','aria-hidden':true},
        h('path',{d:paths[kind],stroke:'currentColor',strokeWidth:1.4,strokeLinecap:'round',strokeLinejoin:'round'}))
    }

    // The original quote and two images stay in DSH's submission model. Collapse
    // only the corresponding native draft decorations; leave ordinary uploads alone.
    function compactNative(card, quotes, keys) {
      const hidden = new Set()
      const nodes = card.querySelectorAll('[contenteditable=true] [data-composer-quote]')
      if (nodes.length === quotes.length) {
        quotes.forEach((q,i) => { if (noteKey(q)) hidden.add(nodes[i]) })
      }
      const filenames = keys.flatMap(key => ['注释-' + key + '-选区.png', '注释-' + key + '-可视区.png'])
      for (const group of card.querySelectorAll('[role=group]')) {
        if (!group.querySelector('img')) continue
        const items = [...group.children]
        for (const item of items) {
          const image = item.querySelector('img')
          if (!image) continue
          if (filenames.includes(image.alt) || [...item.querySelectorAll('button[aria-label]')].some(button =>
            filenames.some(name => button.getAttribute('aria-label').includes(name)))) hidden.add(item)
        }
        if (items.length && items.every(item => hidden.has(item))) {
          const outer = group.parentElement?.parentElement
          if (outer?.parentElement === card) hidden.add(outer)
        }
      }
      for (const old of card.querySelectorAll('[data-dsba-native]')) {
        if (!hidden.has(old)) old.removeAttribute('data-dsba-native')
      }
      for (const node of hidden) node.setAttribute('data-dsba-native','')
    }

    function ComposerNotes({ ctx, owningSession }) {
      const binding = ctx.sessions.binding(owningSession)
      return binding ? h(BoundNotes,{key:owningSession,ctx,binding}) : null
    }

    function BoundNotes({ ctx, binding }) {
      const input = ctx.conversation.input.for(binding.ctx)
      const state = React.useSyncExternalStore(input.state.subscribe, input.state.getSnapshot)
      const uploads = React.useSyncExternalStore(ctx.conversation.fileUploads.subscribe, ctx.conversation.fileUploads.getSnapshot)
      const quotes = input.draftSnapshot.quotes || []
      const notes = quotes.filter(noteKey)
      const keys = notes.map(noteKey)
      const files = relatedFiles(ctx,input,keys)
      const [open,setOpen] = React.useState(false)
      const [peek,setPeek] = React.useState(false)
      const hoverTimer = React.useRef(null)
      const expanded = open || peek
      const [editing,setEditing] = React.useState(null)
      const [value,setValue] = React.useState('')
      const root = React.useRef(null)
      const locked = state.phase !== 'plain'
      const keyList = keys.join(',')
      const previous = React.useRef([])
      React.useLayoutEffect(() => {
        const card = root.current?.closest('[data-composer-card]')
        if (!card) return
        const refresh = () => compactNative(card,input.draftSnapshot.quotes || [],(input.draftSnapshot.quotes || []).map(noteKey).filter(Boolean))
        refresh()
        if (!notes.length) return
        const size = new ResizeObserver(() => {
          root.current?.style.setProperty('--dsba-card-width',Math.max(100,card.clientWidth-24)+'px')
        })
        size.observe(card)
        const observer = new MutationObserver(refresh)
        observer.observe(card,{childList:true,subtree:true,attributes:true,attributeFilter:['alt','aria-label','contenteditable']})
        return () => {
          observer.disconnect()
          size.disconnect()
          card.querySelectorAll('[data-dsba-native]').forEach(el => el.removeAttribute('data-dsba-native'))
        }
      },[input,keyList])
      React.useEffect(() => {
        const removed = previous.current.filter(key => !keys.includes(key))
        previous.current = keys
        if (removed.length && state.phase === 'plain') releaseFiles(ctx,input,relatedFiles(ctx,input,removed).map(a=>a.id))
        if (!notes.length) { clearTimeout(hoverTimer.current); setOpen(false); setPeek(false); setEditing(null) }
      },[keyList,state.phase])
      React.useEffect(() => {
        if (!expanded) return
        const dismiss = e => {
          if (!root.current?.contains(e.target)) { clearTimeout(hoverTimer.current); setPeek(false); setOpen(false); setEditing(null) }
        }
        document.addEventListener('pointerdown',dismiss,true)
        return () => document.removeEventListener('pointerdown',dismiss,true)
      },[expanded])
      React.useEffect(() => () => clearTimeout(hoverTimer.current),[])
      function remove(list) {
        if (input.state.getSnapshot().phase !== 'plain') return
        const rows = relatedFiles(ctx,input,list)
        writeNotes(input,new Map(list.map(k=>[k,null])),[])
        releaseFiles(ctx,input,rows.map(row=>row.id))
        setEditing(null)
      }
      function commit(q) {
        if (!value.trim() || input.state.getSnapshot().phase !== 'plain') return
        const body = value.trim()
        const text = q.text.slice(0,q.text.length-q.summary.body.length) + body
        const key = noteKey(q)
        writeNotes(input,new Map([[key,{...q,text,summary:{...q.summary,body}}]]),[])
        setEditing(null)
      }
      function iconButton(kind,label,fn) {
        return h('button',{type:'button',className:'dsba-icon','aria-label':label,title:label,disabled:locked,onClick:fn},annotationIcon(kind))
      }
      function row(q,i) {
        const key = noteKey(q)
        const pair = files.filter(a=>a.file.name.includes(key))
        const crop = pair.find(a=>a.file.name.endsWith('选区.png'))
        const failed = pair.filter(a=>uploads[a.id]?.status==='error')
        const edit = editing === key
        return h('div',{className:'dsba-note',key},
          h('div',{className:'dsba-note-top'},
            crop && h('img',{className:'dsba-thumb',alt:'选区缩略图',src:crop.previewUrl}),
            h('code',null,q.summary.title),h('span',{className:'dsba-spacer'}),
            iconButton('edit','编辑第 '+(i+1)+' 条注释',()=>{setOpen(true);setValue(q.summary.body);setEditing(key)}),
            iconButton('delete','删除第 '+(i+1)+' 条注释',()=>remove([key]))),
          edit ? h('div',{className:'dsba-edit-note'},
            h('textarea',{autoFocus:true,'aria-label':'修改注释文字',value,rows:2,onChange:e=>setValue(e.target.value),
              onKeyDown:e=>{e.stopPropagation();if(!e.nativeEvent.isComposing && e.key==='Enter' && (e.ctrlKey||e.metaKey)){e.preventDefault();commit(q)}}}),
            h('button',{type:'button',onClick:()=>setEditing(null)},'取消'),
            h('button',{type:'button',disabled:locked||!value.trim(),onClick:()=>commit(q)},'保存'))
            : h('p',null,q.summary.body),
          failed.length>0 && h('button',{type:'button',onClick:()=>failed.forEach(a=>ctx.conversation.retryFileUpload(binding.sessionId,a.id))},'截图上传失败，重试'),
          !pair.length && h('small',null,'此草稿的截图已过期，可重新标注。'))
      }
      return h('div',{ref:root,'data-annotation-composer':binding.sessionId,className:notes.length?'dsba-tray':undefined,
        onPointerEnter:e=>{clearTimeout(hoverTimer.current);if(e.pointerType==='mouse') hoverTimer.current=setTimeout(()=>setPeek(true),160)},
        onPointerLeave:()=>{clearTimeout(hoverTimer.current);hoverTimer.current=setTimeout(()=>setPeek(false),160)},
        onKeyDown:e=>{if(e.key==='Escape'&&expanded){e.stopPropagation();clearTimeout(hoverTimer.current);setOpen(false);setPeek(false);setEditing(null)}}},
        notes.length>0 && h('div',{className:'dsba-pill'},
          h('button',{type:'button','aria-expanded':expanded,onClick:()=>{clearTimeout(hoverTimer.current);setPeek(false);setOpen(!open);setEditing(null)}},annotationIcon('note'),notes.length+' 条注释'),
          iconButton('close','移除全部注释',()=>remove(keys))),
        expanded && notes.length>0 && h('div',{className:'dsba-popover',role:'group','aria-label':'网页注释列表'},notes.map(row)))
    }

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

    function element(tag, cls, text) {
      const node = document.createElement(tag)
      if (cls) node.className = 'dsba-' + cls
      if (text !== undefined) node.textContent = text
      return node
    }

    function action(text, callback) {
      const button = element('button', 'button', text)
      button.type = 'button'
      button.onclick = callback
      return button
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value))
    }

    function setBox(box, r) {
      Object.assign(box.style, { left: r.left * 100 + '%', top: r.top * 100 + '%',
        width: (r.right - r.left) * 100 + '%', height: (r.bottom - r.top) * 100 + '%' })
    }

    function editorIcon(path) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
      svg.setAttribute('viewBox','0 0 24 24')
      svg.setAttribute('aria-hidden','true')
      const line = document.createElementNS(svg.namespaceURI,'path')
      line.setAttribute('d',path)
      svg.append(line)
      return svg
    }

    function installPanel(ctx, guest, toolbar, content) {
      const toggle = action('注释', () => layer ? close() : open())
      toggle.classList.add('dsba-toggle')
      toggle.title = '选择网页元素并添加注释'
      toggle.setAttribute('aria-pressed','false')
      toolbar.append(toggle)
      const lifetime = new AbortController()
      let layer, stage, strip, status, outline, label, editor, snapshot, selection, resize
      let generation = 0, hoverVersion = 0, busy = false, drag, pendingPoint, reading = false
      let retainedText = ''
      const hint = '点选网页元素，也可拖动框选区域'

      function close(focus = true) {
        generation++; hoverVersion++
        resize?.disconnect(); resize = null
        layer?.remove(); strip?.remove()
        layer = stage = strip = status = outline = label = editor = snapshot = selection = null
        pendingPoint = drag = null
        busy = false; retainedText = ''
        toggle.setAttribute('aria-pressed','false')
        if (focus) toggle.focus({preventScroll:true})
      }
      function point(e) {
        const b = stage.getBoundingClientRect()
        return {x:clamp((e.clientX-b.left)/b.width,0,1),y:clamp((e.clientY-b.top)/b.height,0,1)}
      }
      function draw(target) {
        outline.hidden = !target
        if (!target) return
        setBox(outline,target.rect)
        label.textContent = target.tag
        label.style.top = target.rect.top * stage.clientHeight < 24 ? '0' : '-21px'
      }
      async function hover() {
        if (reading) return
        reading = true
        try {
          while (pendingPoint && stage && !busy && !selection) {
            const p = pendingPoint, version = hoverVersion
            pendingPoint = null
            let target
            try { target = await targetAt(guest,p) } catch { target = null }
            if (version === hoverVersion && stage && !busy && !selection) draw(target)
          }
        } finally { reading = false }
      }
      function pickAgain() {
        selection = snapshot = null
        layer.onpointerdown = null
        if (editor) resize?.unobserve(editor)
        editor?.remove(); editor = null
        stage.querySelector('img')?.remove()
        layer.classList.remove('dsba-frozen')
        stage.style.width = stage.style.height = ''
        draw(null); status.textContent = hint
        layer.focus({preventScroll:true})
      }
      function positionEditor() {
        if (!selection || !editor || !snapshot) return
        const scale = Math.min(layer.clientWidth/snapshot.naturalWidth,layer.clientHeight/snapshot.naturalHeight)
        stage.style.width = Math.floor(snapshot.naturalWidth*scale)+'px'
        stage.style.height = Math.floor(snapshot.naturalHeight*scale)+'px'
        const r=selection.rect
        const x=stage.offsetLeft+r.left*stage.clientWidth
        const y=stage.offsetTop+r.bottom*stage.clientHeight+7
        const above=stage.offsetTop+r.top*stage.clientHeight-editor.offsetHeight-7
        editor.style.left=clamp(x,4,layer.clientWidth-editor.offsetWidth-4)+'px'
        const top=clamp(y+editor.offsetHeight<=layer.clientHeight ? y : above,4,layer.clientHeight-editor.offsetHeight-4)
        editor.style.top=top+'px'
        const roomBelow=layer.clientHeight-top-editor.offsetHeight
        const menuAbove=roomBelow<130 && top>roomBelow
        editor.dataset.menuSide=menuAbove?'above':'below'
        editor.style.setProperty('--dsba-menu-room', Math.max(24,(menuAbove?top:roomBelow)-8)+'px')
      }
      function showEditor() {
        editor = element('div','editor')
        editor.setAttribute('role','group')
        editor.setAttribute('aria-label','网页注释')
        const field = element('textarea','field')
        field.rows = 1; field.placeholder = '添加注释…'; field.setAttribute('aria-label','注释内容')
        field.value = retainedText
        async function save(again) {
          if (busy || !field.value.trim()) return
          const token = generation
          busy = true
          editor.inert = true
          try {
            const {binding,input} = composerFor(ctx,guest)
            const note = {...selection,key:crypto.randomUUID(),text:field.value.trim(),url:guest.getURL()}
            const files = await makePair(snapshot,note,note.key)
            if (generation!==token) return
            putInComposer(ctx,guest,binding,files,makeQuote(note))
            retainedText = ''
            if (again) { pickAgain(); layer.focus({preventScroll:true}) }
            else { close(false); input.focus() }
          } catch (error) {
            if (generation===token) status.textContent=error.message || '保存失败，请重试。'
          } finally {
            if (generation===token) { busy=false; if(editor) editor.inert=false }
          }
        }
        const add=action('',()=>save(false))
        add.className='dsba-confirm'
        add.setAttribute('aria-label','保存注释')
        add.title='保存注释（Ctrl / ⌘ + Enter）'
        add.append(editorIcon('m5.5 12.5 4 4 9-10'))
        const options=element('details','options')
        const trigger=element('summary','options-trigger')
        trigger.setAttribute('aria-label','注释选项')
        trigger.title='注释选项'
        trigger.append(editorIcon('M3 7h7m5 0h6M3 17h2m5 0h11 M15 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0 M10 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'))
        const menu=element('div','options-list')
        const next=action('保存并继续',()=>{options.open=false;void save(true)})
        menu.append(next,action('重选',pickAgain),action('取消',()=>close()))
        options.append(trigger,menu)
        options.onfocusout=e=>{if(e.relatedTarget && !options.contains(e.relatedTarget)) options.open=false}
        layer.onpointerdown=e=>{if(!options.contains(e.target)) options.open=false}
        const changed=()=>{retainedText=field.value;add.disabled=next.disabled=!field.value.trim()}
        field.oninput=changed
        field.onkeydown=e=>{if(!e.isComposing && e.key==='Enter' && (e.ctrlKey||e.metaKey)){e.preventDefault();add.click()}}
        editor.append(options,field,add);layer.append(editor)
        resize?.observe(editor)
        changed();positionEditor()
        field.focus({preventScroll:true})
      }
      async function select(target,p) {
        const token=generation
        busy=true; hoverVersion++; pendingPoint=null
        try {
          if (!target) target=await targetAt(guest,p)
          if (token!==generation) return
          if (!target) throw new Error('此处没有可选择的元素，可拖动框选。')
          const frame=await guest.capturePage()
          if (token!==generation) return
          if (frame.isEmpty()) throw new Error('请等网页显示后重试。')
          const img=new Image()
          img.src=frame.toDataURL();await img.decode()
          if (token!==generation) return
          snapshot=img;selection=target
          img.alt='选中时的网页可视区';img.draggable=false
          stage.prepend(img);layer.classList.add('dsba-frozen');draw(target)
          status.textContent='已选中 '+target.tag
          showEditor()
        } catch(error) {
          if (token===generation) { pickAgain();status.textContent=error.message || '读取元素失败，可重试或拖动框选。' }
        } finally { if(token===generation) busy=false }
      }
      function open() {
        generation++
        layer=element('div','overlay');layer.tabIndex=-1
        strip=element('div','strip');status=element('span','status',hint);status.setAttribute('role','status');strip.append(status)
        stage=element('div','stage');outline=element('div','region');label=element('span','element-label')
        outline.hidden=true;outline.append(label);stage.append(outline);layer.append(stage)
        toolbar.append(strip);content.append(layer);toggle.setAttribute('aria-pressed','true')
        layer.focus({preventScroll:true})
        resize=new ResizeObserver(positionEditor);resize.observe(layer)
        stage.onpointerdown=e=>{
          if(e.button!==0 || !e.isPrimary || busy || selection) return
          e.preventDefault();drag={...point(e),id:e.pointerId,area:false}
          stage.setPointerCapture(e.pointerId)
        }
        const rect=(a,b)=>({left:Math.min(a.x,b.x),right:Math.max(a.x,b.x),top:Math.min(a.y,b.y),bottom:Math.max(a.y,b.y)})
        stage.onpointermove=e=>{
          if(busy || selection) return
          const p=point(e)
          if(drag){
            if(e.pointerId!==drag.id) return
            if(Math.hypot((p.x-drag.x)*stage.clientWidth,(p.y-drag.y)*stage.clientHeight)>5) drag.area=true
            if(drag.area) {hoverVersion++;pendingPoint=null;draw({tag:'区域',rect:rect(drag,p)})}
          } else {
            hoverVersion++;pendingPoint=p;void hover()
          }
        }
        stage.onpointerleave=()=>{if(!drag&&!selection&&!busy){hoverVersion++;pendingPoint=null;draw(null)}}
        stage.onpointerup=e=>{
          if(!drag||e.pointerId!==drag.id) return
          const p=point(e),r=rect(drag,p)
          const manual=drag.area && (r.right-r.left)*stage.clientWidth>=3 && (r.bottom-r.top)*stage.clientHeight>=3
          drag=null;stage.releasePointerCapture(e.pointerId)
          void select(manual?{tag:'区域',rect:r,path:''}:null,p)
        }
        stage.onpointercancel=stage.onlostpointercapture=()=>{if(drag){drag=null;draw(null)}}
      }
      window.addEventListener('keydown',e=>{
        if(!layer || e.key!=='Escape' || e.isComposing || !layer.getClientRects().length) return
        const panel=document.activeElement?.closest('[data-sidebar-right-tab]')
        if(panel && !panel.contains(toggle)) return
        e.preventDefault();e.stopImmediatePropagation()
        const options=editor?.querySelector('.dsba-options[open]')
        if(options){options.open=false;editor.querySelector('textarea')?.focus();return}
        close()
      },{capture:true,signal:lifetime.signal})
      guest.addEventListener('did-start-navigation',e=>{if(e.isMainFrame && layer) close(false)},{signal:lifetime.signal})
      return ()=>{lifetime.abort();close(false);toggle.remove()}
    }

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

    return { inject: ['slots', 'sessions', 'conversation'], apply }
  }
})
