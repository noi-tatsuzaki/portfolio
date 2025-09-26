// scripts/generate-works-json.js
const fs = require("fs");
const path = require("path");

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

async function generateWorksJson() {
  const worksDir = path.join('_works');
  const outputFile = path.join('public', 'works.json');
  
  // Ensure public directory exists
  fs.mkdirSync('public', { recursive: true });
  
  const files = fs.readdirSync(worksDir).filter(file => file.endsWith('.md'));
  const works = [];
  
  for (const file of files) {
    const filePath = path.join(worksDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontMatter } = parseFrontMatter(content);
    
    const work = {
      id: file.replace('.md', ''),
      title: frontMatter.title || 'Untitled',
      summary: frontMatter.summary || '',
      tags: frontMatter.tags || [],
      date: formatDate(frontMatter.date),
      url: frontMatter.url || '',
      cover: frontMatter.cover || '',
      lastEdited: new Date().toISOString()
    };
    
    works.push(work);
  }
  
  // Sort by date (newest first)
  works.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
  
  fs.writeFileSync(outputFile, JSON.stringify(works, null, 2));
  console.log(`Generated ${works.length} works to ${outputFile}`);
}

generateWorksJson().catch(console.error);
