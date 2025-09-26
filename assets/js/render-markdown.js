// assets/js/render-markdown.js
(function () {
  const MD_FILES = [
    'public/works/sharky.md',
    'public/works/boat-race-project.md',
    'public/works/smart-watering-system.md',
    'public/works/ai-buta-camera.md',
    'public/works/lvns-forest-project.md',
    'public/works/frc-2023-hello.md'
  ];
  
  const TARGET = document.querySelector("#works-container");
  const tpl = document.querySelector("#tpl-md-card");

  if (!TARGET || !tpl) {
    console.warn("TARGET or template not found (need #works-container and #tpl-md-card).");
    return;
  }

  function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
      return { frontMatter: {}, content: content };
    }

    const frontMatterText = match[1];
    const markdownContent = match[2];
    
    // Parse YAML-like front matter
    const frontMatter = {};
    const lines = frontMatterText.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;
      
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontMatter[key] = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''));
      } else {
        frontMatter[key] = value;
      }
    }
    
    return { frontMatter, content: markdownContent };
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  }

  function setText(el, v) { 
    if (!el) return; 
    if (v) { 
      el.textContent = v; 
    } else { 
      el.remove(); 
    } 
  }
  
  function setHref(el, v) { 
    if (!el) return; 
    if (v) { 
      el.setAttribute("href", v); 
    } else { 
      el.removeAttribute("href"); 
    } 
  }
  
  function setSrc(el, v) { 
    if (!el) return; 
    if (v) { 
      el.setAttribute("src", v); 
    } else { 
      el.remove(); 
    } 
  }

  async function loadMarkdownFile(filePath) {
    try {
      console.log(`Loading: ${filePath}`);
      const response = await fetch(filePath);
      if (!response.ok) {
        console.warn(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
        return null;
      }
      const content = await response.text();
      console.log(`Successfully loaded ${filePath}, content length: ${content.length}`);
      console.log(`Content preview:`, content.substring(0, 200) + '...');
      const { frontMatter } = parseFrontMatter(content);
      console.log(`Parsed front matter:`, frontMatter);
      
      return {
        id: filePath.replace('public/works/', '').replace('.md', ''),
        title: frontMatter.title || 'Untitled',
        summary: frontMatter.summary || '',
        tags: frontMatter.tags || [],
        date: formatDate(frontMatter.date),
        url: frontMatter.url || '',
        cover: frontMatter.cover || '',
        lastEdited: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
      return null;
    }
  }

  async function loadAllMarkdownFiles() {
    const items = [];
    
    for (const filePath of MD_FILES) {
      const item = await loadMarkdownFile(filePath);
      if (item) {
        items.push(item);
      }
    }
    
    // Sort by date (newest first)
    items.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
    
    return items;
  }

  function renderItems(items) {
    const frag = document.createDocumentFragment();
    
    items.forEach(item => {
      const node = tpl.content.cloneNode(true);
      
      // Set text content
      node.querySelectorAll("[data-text]").forEach(el => {
        const key = el.getAttribute("data-text");
        setText(el, item[key]);
      });
      
      // Set href attributes
      node.querySelectorAll("[data-href]").forEach(el => {
        const key = el.getAttribute("data-href");
        setHref(el, item[key]);
      });
      
      // Set src attributes
      node.querySelectorAll("[data-src]").forEach(el => {
        const key = el.getAttribute("data-src");
        setSrc(el, item[key]);
      });
      
      // Set tags
      node.querySelectorAll("[data-tags]").forEach(el => {
        const key = el.getAttribute("data-tags");
        const arr = Array.isArray(item[key]) ? item[key] : [];
        if (!arr.length) { 
          el.remove(); 
          return; 
        }
        el.textContent = arr.join(" · ");
      });
      
      frag.appendChild(node);
    });
    
    TARGET.appendChild(frag);
  }

  // Load and render markdown files with fallback to JSON
  loadAllMarkdownFiles()
    .then(items => {
      console.log(`Loaded ${items.length} markdown files`);
      if (items.length === 0) {
        console.log('No markdown files loaded, trying JSON fallback...');
        // Fallback to JSON if markdown files fail
        return fetch('public/works.json', { cache: "no-store" })
          .then(response => {
            if (!response.ok) throw new Error(`JSON fetch failed: ${response.status}`);
            return response.json();
          })
          .then(jsonItems => {
            console.log(`Loaded ${jsonItems.length} items from JSON fallback`);
            return jsonItems;
          });
      } else {
        return items;
      }
    })
    .then(items => {
      if (items.length === 0) {
        TARGET.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No works found. Please check the file paths.</p>';
      } else {
        renderItems(items);
      }
    })
    .catch(error => {
      console.error('Error loading works:', error);
      TARGET.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Error loading works. Please check the console for details.</p>';
    });
})();