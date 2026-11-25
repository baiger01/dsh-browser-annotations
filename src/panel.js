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
