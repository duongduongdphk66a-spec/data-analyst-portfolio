/* eslint-disable */
// @ts-nocheck
'use client';
import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function DashboardDemo() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scoped script execution
    const runScript = () => {
      
    const rawGraphData = JSON.parse(document.getElementById('ua-graph-data').textContent);
    let network = null;
    let currentAppFilter = 'all';
    let showAllLabels = true;
    let hideTemplates = false;

    // 6 Concentric Rings Definition
    const CONCENTRIC_RINGS = [
      {
        id: 'ring-1',
        layerId: 'layer:core-and-config',
        radius: 140,
        name: 'Vòng 1: Cấu hình & Lớp lõi (Core & Config)',
        shortName: 'Core & Config',
        color: '#38BDF8',
        desc: 'Tâm hệ thống: settings.py, manage.py, mixin dùng chung và CLI.'
      },
      {
        id: 'ring-2',
        layerId: 'layer:data-and-models',
        radius: 270,
        name: 'Vòng 2: Mô hình dữ liệu & ORM (Models & DB)',
        shortName: 'Models & DB',
        color: '#10B981',
        desc: 'Thực thể cơ sở dữ liệu (ORM), khóa ngoại và migrations.'
      },
      {
        id: 'ring-3',
        layerId: 'layer:services-and-tasks',
        radius: 390,
        name: 'Vòng 3: Tầng nghiệp vụ & Xử lý nền (Services & Tasks)',
        shortName: 'Services & Tasks',
        color: '#F59E0B',
        desc: 'Transactions Service, xử lý mượn/trả và tác vụ ngầm Celery/Redis.'
      },
      {
        id: 'ring-4',
        layerId: 'layer:controllers-and-views',
        radius: 520,
        name: 'Vòng 4: Tầng điều phối & Quản trị (Views & URLs)',
        shortName: 'Views & Controllers',
        color: '#6366F1',
        desc: 'View xử lý request, forms xác thực và trang admin.'
      },
      {
        id: 'ring-5',
        layerId: 'layer:testing-and-qa',
        radius: 650,
        name: 'Vòng 5: Kiểm thử & Tài liệu (QA & Docs)',
        shortName: 'Testing & Docs',
        color: '#8B5CF6',
        desc: 'Bộ Unit Tests, functional test và tài liệu kiến trúc.'
      },
      {
        id: 'ring-6',
        layerId: 'layer:frontend-and-ui',
        radius: 800,
        name: 'Vòng 6-7: Giao diện người dùng (Templates & CSS)',
        shortName: 'Frontend Templates',
        color: '#EC4899',
        desc: 'Vòng ngoài cùng: Hơn 70 templates HTML và stylesheets.'
      }
    ];

    // Node to ring mapping
    const nodeRingMap = {};
    rawGraphData.layers.forEach(layer => {
      layer.nodeIds.forEach(id => {
        const path = id.toLowerCase();
        let ringIndex = 0; // default ring 1
        if (layer.id === 'layer:core-and-config') ringIndex = 0;
        else if (layer.id === 'layer:data-and-models') ringIndex = 1;
        else if (layer.id === 'layer:services-and-tasks') ringIndex = 2;
        else if (layer.id === 'layer:controllers-and-views') ringIndex = 3;
        else if (layer.id === 'layer:testing-and-qa' || layer.id === 'layer:docs-and-specs') ringIndex = 4;
        else if (layer.id === 'layer:frontend-and-ui') ringIndex = 5;

        let app = 'core';
        if (path.includes('transactions')) app = 'transactions';
        else if (path.includes('inventory')) app = 'inventory';
        else if (path.includes('users')) app = 'users';
        else if (path.includes('analytics')) app = 'analytics';
        else if (path.includes('notifications')) app = 'notifications';
        else if (path.includes('blog')) app = 'blog';
        else if (path.includes('template')) app = 'template';

        nodeRingMap[id] = {
          ringIndex: ringIndex,
          ring: CONCENTRIC_RINGS[ringIndex],
          app: app
        };
      });
    });

    document.addEventListener('DOMContentLoaded', () => {
      renderRingsList();
      renderTourList();
      buildConcentricGraph();
      setupSearch();
    });

    function switchSidebarTab(tab) {
      document.getElementById('tab-btn-layers').classList.toggle('active', tab === 'layers');
      document.getElementById('tab-btn-tour').classList.toggle('active', tab === 'tour');
      document.getElementById('tab-layers').style.display = tab === 'layers' ? 'block' : 'none';
      document.getElementById('tab-tour').style.display = tab === 'tour' ? 'block' : 'none';
    }

    function filterByApp(app, element) {
      currentAppFilter = app;
      document.querySelectorAll('.app-pill').forEach(p => p.classList.remove('active'));
      if (element) element.classList.add('active');
      buildConcentricGraph();
    }

    function toggleLabelDensity(showAll) {
      showAllLabels = showAll;
      buildConcentricGraph();
    }

    function toggleTemplates(hide) {
      hideTemplates = hide;
      buildConcentricGraph();
    }

    function renderRingsList() {
      const container = document.getElementById('rings-list');
      container.innerHTML = '';

      CONCENTRIC_RINGS.forEach((ring, idx) => {
        const card = document.createElement('div');
        card.className = 'ring-card';
        card.style.setProperty('--ring-color', ring.color);

        // Count nodes in this ring
        const count = Object.values(nodeRingMap).filter(m => m.ringIndex === idx).length;

        card.innerHTML = `
          <div class="ring-header">
            <div class="ring-name">
              <span style="width:8px;height:8px;border-radius:50%;background:${ring.color};"></span>
              ${ring.shortName}
            </div>
            <span class="ring-order-badge">${count} tệp</span>
          </div>
          <div class="ring-desc">${ring.desc}</div>
        `;

        card.addEventListener('click', () => {
          highlightRing(idx);
          document.querySelectorAll('.ring-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });

        container.appendChild(card);
      });
    }

    function renderTourList() {
      const container = document.getElementById('tour-list');
      container.innerHTML = '';

      rawGraphData.tour.forEach(step => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.innerHTML = `
          <div class="tour-order">BƯỚC ${step.order} / 7</div>
          <div class="tour-title">${step.title}</div>
          <div class="tour-desc">${step.description}</div>
        `;

        card.addEventListener('click', () => {
          highlightNodes(step.nodeIds);
          document.querySelectorAll('.tour-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });

        container.appendChild(card);
      });
    }

    function buildConcentricGraph() {
      const container = document.getElementById('network');

      // Filter visible nodes
      let visibleNodes = rawGraphData.nodes.filter(n => {
        if (!['file', 'config', 'document', 'service'].includes(n.type)) return false;
        const meta = nodeRingMap[n.id];
        if (!meta) return false;

        if (hideTemplates && meta.ringIndex === 5) return false;
        if (currentAppFilter !== 'all' && meta.app !== currentAppFilter) return false;

        return true;
      });

      // Group nodes by ring to position them evenly along each circle
      const nodesByRing = [[], [], [], [], [], []];
      visibleNodes.forEach(n => {
        const ringIdx = nodeRingMap[n.id].ringIndex;
        nodesByRing[ringIdx].push(n);
      });

      const visNodes = [];

      nodesByRing.forEach((ringNodes, ringIdx) => {
        const ringConfig = CONCENTRIC_RINGS[ringIdx];
        const count = ringNodes.length;
        if (count === 0) return;

        ringNodes.forEach((node, i) => {
          let radius = ringConfig.radius;
          // For Ring 6 (templates), alternate radii (800 & 940) if there are many to prevent any overlap
          if (ringIdx === 5 && count > 40) {
            radius = (i % 2 === 0) ? 780 : 920;
          }

          const angle = (2 * Math.PI / count) * i;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const isSignificant = node.complexity === 'complex' || 
            node.name.includes('models') || 
            node.name.includes('services') || 
            node.name.includes('views') || 
            node.name.includes('settings') ||
            node.name.includes('tasks');

          visNodes.push({
            id: node.id,
            x: x,
            y: y,
            fixed: true, // Lock strictly to concentric circle!
            label: (showAllLabels || isSignificant) ? node.name : '',
            title: `<strong>${node.name}</strong><br>${node.filePath}<br><em>${node.summary || ''}</em>`,
            shape: 'dot',
            size: isSignificant ? 13 : 8,
            color: {
              background: ringConfig.color,
              border: 'rgba(255,255,255,0.7)',
              highlight: { background: '#FFFFFF', border: ringConfig.color }
            },
            font: {
              color: '#E2E8F0',
              size: 11,
              face: 'Plus Jakarta Sans',
              strokeWidth: 2,
              strokeColor: '#070A12'
            }
          });
        });
      });

      const visibleNodeSet = new Set(visNodes.map(n => n.id));

      const visEdges = rawGraphData.edges
        .filter(e => visibleNodeSet.has(e.source) && visibleNodeSet.has(e.target))
        .map(e => ({
          from: e.source,
          to: e.target,
          arrows: 'to',
          color: {
            color: 'rgba(255,255,255,0.1)',
            highlight: '#38BDF8',
            hover: '#38BDF8'
          },
          width: e.type === 'imports' ? 1.2 : 0.8,
          smooth: {
            type: 'continuous',
            roundness: 0.2
          }
        }));

      const data = {
        nodes: new vis.DataSet(visNodes),
        edges: new vis.DataSet(visEdges)
      };

      const options = {
        physics: { enabled: false }, // Pure geometric concentric placement
        interaction: {
          hover: true,
          tooltipDelay: 100,
          zoomView: true,
          dragView: true
        }
      };

      network = new vis.Network(container, data, options);

      // Draw Glowing Concentric Track Rings
      network.on('beforeDrawing', (ctx) => {
        ctx.save();
        CONCENTRIC_RINGS.forEach((ring, idx) => {
          if (hideTemplates && idx === 5) return;

          // Draw main ring
          ctx.beginPath();
          ctx.arc(0, 0, ring.radius, 0, 2 * Math.PI);
          ctx.strokeStyle = ring.color + '22'; // subtle line
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 8]);
          ctx.stroke();

          // If Ring 6 has outer sub-ring
          if (idx === 5 && !hideTemplates) {
            ctx.beginPath();
            ctx.arc(0, 0, 920, 0, 2 * Math.PI);
            ctx.strokeStyle = ring.color + '15';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
          }

          // Draw ring name watermark
          ctx.fillStyle = ring.color + '66';
          ctx.font = 'bold 11px Plus Jakarta Sans';
          ctx.fillText(ring.shortName.toUpperCase(), 12, -ring.radius + 14);
        });
        ctx.restore();
      });

      network.on('click', (params) => {
        if (params.nodes.length > 0) {
          openInspector(params.nodes[0]);
        } else {
          closeInspector();
        }
      });

      setTimeout(() => {
        network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
      }, 200);
    }

    function highlightRing(ringIdx) {
      const targetIds = Object.keys(nodeRingMap).filter(id => nodeRingMap[id].ringIndex === ringIdx);
      highlightNodes(targetIds);
    }

    function highlightNodes(nodeIds) {
      if (!network) return;
      const validIds = nodeIds.filter(id => network.body.nodes[id]);
      if (validIds.length === 0) return;

      network.selectNodes(validIds);
      network.fit({
        nodes: validIds,
        animation: { duration: 600, easingFunction: 'easeInOutQuad' }
      });
    }

    function openInspector(nodeId) {
      const node = rawGraphData.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const panel = document.getElementById('inspector');
      panel.classList.add('visible');

      document.getElementById('ins-type').textContent = node.type;
      document.getElementById('ins-title').textContent = node.name;
      document.getElementById('ins-path').textContent = node.filePath || node.id;
      document.getElementById('ins-summary').textContent = node.summary || 'Không có mô tả chi tiết.';

      const tagsContainer = document.getElementById('ins-tags');
      tagsContainer.innerHTML = (node.tags || []).map(t => `<span class="node-tag">#${t}</span>`).join('');

      const connContainer = document.getElementById('ins-connections');
      connContainer.innerHTML = '';

      const outgoing = rawGraphData.edges.filter(e => e.source === nodeId);
      const incoming = rawGraphData.edges.filter(e => e.target === nodeId);

      if (outgoing.length === 0 && incoming.length === 0) {
        connContainer.innerHTML = '<div style="font-size:11px;color:var(--text-dim);">Không có liên kết phụ thuộc trực tiếp.</div>';
      } else {
        outgoing.slice(0, 8).forEach(e => {
          const targetNode = rawGraphData.nodes.find(n => n.id === e.target);
          const item = document.createElement('div');
          item.className = 'connection-item';
          item.innerHTML = `<span>→ ${e.type}: <strong>${targetNode ? targetNode.name : e.target.split(':').pop()}</strong></span>`;
          item.onclick = () => focusNode(e.target);
          connContainer.appendChild(item);
        });

        incoming.slice(0, 8).forEach(e => {
          const sourceNode = rawGraphData.nodes.find(n => n.id === e.source);
          const item = document.createElement('div');
          item.className = 'connection-item';
          item.innerHTML = `<span>← ${e.type}: <strong>${sourceNode ? sourceNode.name : e.source.split(':').pop()}</strong></span>`;
          item.onclick = () => focusNode(e.source);
          connContainer.appendChild(item);
        });
      }
    }

    function closeInspector() {
      document.getElementById('inspector').classList.remove('visible');
    }

    function focusNode(nodeId) {
      if (!network) return;
      try {
        network.selectNodes([nodeId]);
        network.focus(nodeId, {
          scale: 1.3,
          animation: { duration: 500, easingFunction: 'easeInOutQuad' }
        });
        openInspector(nodeId);
      } catch (e) {
        console.warn(e);
      }
    }

    function setupSearch() {
      const input = document.getElementById('node-search');
      input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) return;

        const match = rawGraphData.nodes.find(n => 
          n.name.toLowerCase().includes(term) || (n.filePath && n.filePath.toLowerCase().includes(term))
        );

        if (match && network.body.nodes[match.id]) {
          focusNode(match.id);
        }
      });
    }

    function zoomIn() {
      if (!network) return;
      network.moveTo({ scale: network.getScale() * 1.3 });
    }

    function zoomOut() {
      if (!network) return;
      network.moveTo({ scale: network.getScale() / 1.3 });
    }

    function fitGraph() {
      if (!network) return;
      network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
    }
  
    };
    
    // Give DOM time to paint before running heavy scripts
    const timer = setTimeout(() => {
      try {
        runScript();
      } catch (e) {
        console.error('Demo Script Error:', e);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js" strategy="afterInteractive" />
      <style dangerouslySetInnerHTML={{ __html: `
    :root {
      --bg-primary: #070A12;
      --bg-secondary: #0F172A;
      --bg-card: rgba(15, 23, 42, 0.85);
      --bg-glass: rgba(255, 255, 255, 0.03);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(56, 189, 248, 0.5);
      
      --ring-1: #38BDF8; /* Core */
      --ring-2: #10B981; /* Models */
      --ring-3: #F59E0B; /* Services */
      --ring-4: #6366F1; /* Views */
      --ring-5: #8B5CF6; /* Testing & Docs */
      --ring-6: #EC4899; /* Templates */
      
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-primary);
      color: var(--text-main);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Header */
    header {
      height: 60px;
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 50;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      background: linear-gradient(135deg, #38BDF8, #6366F1);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
      color: white;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
    }

    .brand-text h1 {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-text span {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Rings Quick Legend in Header */
    .rings-legend {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid var(--border-color);
    }

    .ring-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .ring-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* Search & Actions */
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-box {
      position: relative;
      width: 220px;
    }

    .search-box input {
      width: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 6px 10px 6px 30px;
      font-size: 12px;
      color: var(--text-main);
      outline: none;
      transition: all 0.2s;
    }

    .search-box input:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: var(--text-dim);
    }

    /* App Filter Bar */
    .filter-bar {
      height: 42px;
      background: rgba(11, 15, 25, 0.7);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 8px;
      overflow-x: auto;
      z-index: 45;
    }

    .filter-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      margin-right: 4px;
      white-space: nowrap;
    }

    .app-pill {
      background: var(--bg-glass);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .app-pill:hover {
      border-color: rgba(255, 255, 255, 0.25);
      color: var(--text-main);
    }

    .app-pill.active {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    /* Dashboard Layout */
    .dashboard-body {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    /* Left Sidebar */
    aside.sidebar {
      width: 320px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 40;
    }

    .sidebar-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      padding: 6px;
      gap: 4px;
      background: rgba(11, 15, 25, 0.4);
    }

    .tab-btn {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .tab-btn.active {
      background: rgba(56, 189, 248, 0.12);
      color: var(--accent-cyan);
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
    }

    .concentric-guide-card {
      background: rgba(56, 189, 248, 0.05);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 12px;
      font-size: 11px;
      line-height: 1.4;
      color: var(--text-muted);
    }

    .concentric-guide-card strong {
      color: var(--accent-cyan);
    }

    /* Ring cards in sidebar */
    .ring-card {
      background: var(--bg-glass);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ring-card:hover {
      border-color: rgba(255, 255, 255, 0.25);
    }

    .ring-card.active {
      border-color: var(--ring-color, var(--accent-cyan));
      background: rgba(255, 255, 255, 0.06);
    }

    .ring-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .ring-name {
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ring-order-badge {
      font-size: 10px;
      font-family: var(--font-mono);
      background: rgba(255, 255, 255, 0.08);
      padding: 1px 5px;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .ring-desc {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.35;
    }

    /* Tour Cards */
    .tour-card {
      background: var(--bg-glass);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tour-card:hover {
      border-color: var(--accent-indigo);
    }

    .tour-card.active {
      border-color: var(--accent-cyan);
      background: rgba(56, 189, 248, 0.08);
    }

    .tour-order {
      font-size: 10px;
      color: var(--accent-cyan);
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .tour-title {
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .tour-desc {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Canvas Area */
    #graph-container {
      flex: 1;
      height: 100%;
      position: relative;
      background: radial-gradient(circle at 50% 50%, #0D1322 0%, #070A12 100%);
    }

    #network {
      width: 100%;
      height: 100%;
    }

    /* Floating View Controls */
    .floating-controls {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 10px;
      z-index: 30;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .toggle-lbl {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .canvas-overlay-controls {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 30;
    }

    .control-btn {
      width: 34px;
      height: 34px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.2s;
    }

    .control-btn:hover {
      background: var(--bg-secondary);
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    /* Inspector Panel */
    .inspector-panel {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 360px;
      max-height: calc(100% - 32px);
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(18px);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      z-index: 45;
      overflow-y: auto;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
      display: none;
    }

    .inspector-panel.visible {
      display: block;
    }

    .inspector-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .inspector-type {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent-cyan);
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 18px;
      cursor: pointer;
    }

    .inspector-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 2px;
      word-break: break-all;
    }

    .inspector-path {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-dim);
      margin-bottom: 12px;
      word-break: break-all;
    }

    .inspector-label {
      font-size: 10px;
      color: var(--text-dim);
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .inspector-summary {
      font-size: 12px;
      color: var(--text-main);
      line-height: 1.45;
      background: var(--bg-glass);
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      margin-bottom: 12px;
    }

    .tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 12px;
    }

    .node-tag {
      font-size: 10px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .connections-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 140px;
      overflow-y: auto;
    }

    .connection-item {
      font-size: 11px;
      font-family: var(--font-mono);
      padding: 5px 8px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
      border-left: 2px solid var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }

    .connection-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  ` }} />
      <div 
        ref={containerRef} 
        dangerouslySetInnerHTML={{ __html: `

  {/* Top Header */}
  <header>
    <div className="brand">
      <div className="brand-badge">UA</div>
      <div className="brand-text">
        <h1>Tủ Sách Lưu Động <span>Bản đồ Vòng Tròn Đồng Tâm (Concentric Radar)</span></h1>
      </div>
    </div>

    {/* Concentric Legend */}
    <div className="rings-legend">
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 1: Core</div>
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 2: Models</div>
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 3: Services</div>
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 4: Views</div>
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 5: Tests</div>
      <div className="ring-pill"><span className="ring-dot" ></span> Vòng 6-7: Templates</div>
    </div>

    {/* Search Box */}
    <div className="header-right">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" id="node-search" placeholder="Tìm kiếm file, model, view..." />
      </div>
    </div>
  </header>

  {/* Filter Bar by App */}
  <div className="filter-bar">
    <span className="filter-title">Lọc theo App:</span>
    <button className="app-pill active" onClick="filterByApp('all', this)">Tất cả (Toàn cảnh)</button>
    <button className="app-pill" onClick="filterByApp('transactions', this)">Transactions</button>
    <button className="app-pill" onClick="filterByApp('inventory', this)">Inventory</button>
    <button className="app-pill" onClick="filterByApp('users', this)">Users</button>
    <button className="app-pill" onClick="filterByApp('analytics', this)">Analytics</button>
    <button className="app-pill" onClick="filterByApp('notifications', this)">Notifications</button>
    <button className="app-pill" onClick="filterByApp('blog', this)">Blog</button>
    <button className="app-pill" onClick="filterByApp('core', this)">Core & Config</button>
    <button className="app-pill" onClick="filterByApp('template', this)">Templates</button>
  </div>

  {/* Main Body */}
  <div className="dashboard-body">
    {/* Left Sidebar */}
    <aside className="sidebar">
      <div className="sidebar-tabs">
        <button className="tab-btn active" id="tab-btn-layers" onClick="switchSidebarTab('layers')">⭕ 6 Vòng Đồng Tâm</button>
        <button className="tab-btn" id="tab-btn-tour" onClick="switchSidebarTab('tour')">🗺️ Guided Tour</button>
      </div>

      <div className="tab-content" id="tab-layers">
        <div className="concentric-guide-card">
          💡 <strong>Cấu trúc Radar Đồng Tâm:</strong><br />
          Tâm trong cùng là <strong>Lõi hệ thống</strong>, mở rộng dần ra các tầng <strong>Dữ liệu</strong> ➔ <strong>Nghiệp vụ</strong> ➔ <strong>Giao diện ngoài cùng</strong>. Không còn bị đè chữ hay rối chéo!
        </div>
        <div id="rings-list"></div>
      </div>

      <div className="tab-content" id="tab-tour" >
        <div id="tour-list"></div>
      </div>
    </aside>

    {/* Canvas */}
    <main id="graph-container">
      <div id="network"></div>

      {/* Floating Controls */}
      <div className="floating-controls">
        <label className="toggle-lbl">
          <input type="checkbox" id="chk-show-all-labels" checked onchange="toggleLabelDensity(this.checked)" />
          Hiện nhãn tất cả file
        </label>
        <label className="toggle-lbl">
          <input type="checkbox" id="chk-hide-templates" onchange="toggleTemplates(this.checked)" />
          Ẩn bớt 114 Templates (chỉ xem code)
        </label>
      </div>

      {/* Overlay Controls */}
      <div className="canvas-overlay-controls">
        <button className="control-btn" title="Phóng to" onClick="zoomIn()">+</button>
        <button className="control-btn" title="Thu nhỏ" onClick="zoomOut()">−</button>
        <button className="control-btn" title="Căn giữa toàn màn hình" onClick="fitGraph()">⤢</button>
      </div>
    </main>

    {/* Inspector Panel */}
    <div className="inspector-panel" id="inspector">
      <div className="inspector-header">
        <span className="inspector-type" id="ins-type">File</span>
        <button className="close-btn" onClick="closeInspector()">×</button>
      </div>
      <div className="inspector-title" id="ins-title">services.py</div>
      <div className="inspector-path" id="ins-path">library_bus_project/transactions/services.py</div>

      <div className="inspector-label">Tóm tắt chức năng</div>
      <div className="inspector-summary" id="ins-summary">Tầng nghiệp vụ (business logic) xử lý giao dịch mượn/trả và chống race condition.</div>

      <div className="inspector-label">Từ khóa</div>
      <div className="tag-container" id="ins-tags"></div>

      <div className="inspector-label">Liên kết phụ thuộc</div>
      <div className="connections-list" id="ins-connections"></div>
    </div>
  </div>

  

  
` }} 
        className="w-full min-h-screen bg-slate-900" 
      />
    </>
  );
}
