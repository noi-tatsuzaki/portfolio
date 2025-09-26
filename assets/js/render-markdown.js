// assets/js/render-markdown.js
(function () {
  const JSON_URL = './public/works.json';
  
  const TARGET = document.querySelector("#works-container");
  const tpl = document.querySelector("#tpl-md-card");

  if (!TARGET || !tpl) {
    console.warn("TARGET or template not found (need #works-container and #tpl-md-card).");
    return;
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

  // Load and render works from JSON
  fetch(JSON_URL, { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(items => {
      console.log(`Loaded ${items.length} works from JSON`);
      if (items.length === 0) {
        TARGET.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No works found.</p>';
      } else {
        renderItems(items);
      }
    })
    .catch(error => {
      console.error('Error loading works JSON:', error);
      TARGET.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Error loading works. Please check the console for details.</p>';
    });
})();