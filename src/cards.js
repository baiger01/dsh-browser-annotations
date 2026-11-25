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
