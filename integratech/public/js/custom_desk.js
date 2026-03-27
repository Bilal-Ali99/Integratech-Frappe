frappe.ready(function () {

  // ── Inject Integratech logo into sidebar ──────────────────────────────────
  function injectLogo() {
    const logoArea = document.querySelector('.navbar-brand, .desk-sidebar .frappe-logo-container')
    if (logoArea && !document.querySelector('.it-logo-injected')) {
      logoArea.innerHTML = `
        <div class="it-logo-injected" style="display:flex;align-items:center;gap:10px;">
          <div style="
            width:30px;height:30px;background:#3B82F6;border-radius:8px;
            display:flex;align-items:center;justify-content:center;flex-shrink:0;
          ">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style="
            font-family:'Syne',sans-serif;font-size:15px;font-weight:700;
            color:#F0F4FF;letter-spacing:0.02em;
          ">Integratech</span>
          <span style="
            font-size:10px;color:#3B82F6;background:rgba(59,130,246,0.12);
            padding:2px 7px;border-radius:20px;font-weight:500;letter-spacing:0.05em;
            margin-left:auto;
          ">ERP</span>
        </div>
      `
    }
  }

  // ── Highlight active sidebar item ─────────────────────────────────────────
  function setActiveSidebarItem() {
    const currentPath = window.location.pathname
    document.querySelectorAll('.desk-sidebar .sidebar-item, .desk-sidebar .standard-sidebar-item').forEach(item => {
      const link = item.querySelector('a') || item
      const href = link.getAttribute('href') || ''
      item.classList.toggle('selected', href && currentPath.startsWith(href))
    })
  }

  // ── Add left accent bar to active sidebar items ───────────────────────────
  function addAccentBars() {
    document.querySelectorAll('.desk-sidebar .sidebar-item.selected, .desk-sidebar .standard-sidebar-item.selected').forEach(item => {
      if (!item.querySelector('.it-accent-bar')) {
        const bar = document.createElement('div')
        bar.className = 'it-accent-bar'
        bar.style.cssText = `
          position:absolute;left:-8px;top:50%;transform:translateY(-50%);
          width:3px;height:18px;background:#3B82F6;border-radius:0 3px 3px 0;
        `
        item.style.position = 'relative'
        item.appendChild(bar)
      }
    })
  }

  // ── Style status indicators dynamically ───────────────────────────────────
  function styleIndicators() {
    document.querySelectorAll('.indicator-pill, .indicator').forEach(el => {
      const text = el.textContent.trim().toLowerCase()
      if (text === 'paid' || text === 'submitted' || text === 'completed') {
        el.style.cssText += 'background:#ECFDF5!important;color:#059669!important;border:none!important;'
      } else if (text === 'unpaid' || text === 'draft') {
        el.style.cssText += 'background:#EFF6FF!important;color:#2563EB!important;border:none!important;'
      } else if (text === 'overdue' || text === 'cancelled' || text === 'failed') {
        el.style.cssText += 'background:#FEF2F2!important;color:#EF4444!important;border:none!important;'
      } else if (text === 'pending' || text === 'open') {
        el.style.cssText += 'background:#FFFBEB!important;color:#D97706!important;border:none!important;'
      }
    })
  }

  // ── Add smooth page transitions ───────────────────────────────────────────
  function addPageTransitions() {
    const style = document.createElement('style')
    style.textContent = `
      .page-container { animation: it-fadein 0.18s ease; }
      @keyframes it-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    `
    document.head.appendChild(style)
  }

  // ── Observe DOM changes to re-apply styles ────────────────────────────────
  const observer = new MutationObserver(() => {
    setActiveSidebarItem()
    addAccentBars()
    styleIndicators()
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // ── Init ──────────────────────────────────────────────────────────────────
  injectLogo()
  setActiveSidebarItem()
  addAccentBars()
  styleIndicators()
  addPageTransitions()

  // Re-run on route change
  $(document).on('page-change', function () {
    setTimeout(() => {
      setActiveSidebarItem()
      addAccentBars()
      styleIndicators()
    }, 100)
  })

})
