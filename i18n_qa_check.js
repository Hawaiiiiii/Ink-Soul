#!/usr/bin/env node

/**
 * Script de QA para verificar cadenas hardcodeadas en español
 * Busca textos en español que no están usando el sistema i18n
 */

const fs = require('fs');
const path = require('path');

const SPANISH_PATTERNS = [
  /("[^"]*[¡¿áéíóúñÁÉÍÓÚÑÑüÜ][^"]*")/g,
  /'[^']*[¡¿áéíóúñÁÉÍÓÚÑÑüÜ][^']*'/g,
  /\b(Inicio|Sobre|Citas|Flash|Tienda|Contacto|Ver evento|Comienza en|Días|Horas|Minutos|Otros|Microrealismo|Fineline|BlackWork|Descripción|Título|Enviar|Cancelar|Aceptar|Cerrar|Abrir)\b/g
];

const EXCLUDED_FILES = [
  'i18n.ts', // Archivo de traducciones, debe tener texto en español
  'i18n_qa_check.js',
  '.git',
  'node_modules',
  'dist',
  'build'
];

function shouldExcludeFile(filePath) {
  return EXCLUDED_FILES.some(pattern => 
    filePath.includes(pattern) || filePath.endsWith(pattern)
  );
}

function isTranslationKey(text) {
  // Verifica si es una clave de traducción válida (t('nav.home'), etc.)
  return /t\(['"][^'"]+['"]\)/.test(text);
}

function hasSpanishText(str) {
  // Detecta texto en español básico
  return /[¡¿áéíóúñÁÉÍÓÚÑÑüÜ]/.test(str) && 
         !isTranslationKey(str) &&
         !str.includes('//') && // Comentarios
         !str.includes('/*'); // Comentarios de bloque
}

function findSpanishStrings(filePath, content) {
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, lineNum) => {
    if (hasSpanishText(line)) {
      // Filtrar comentarios y claves de traducción
      if (!line.trim().startsWith('//') && 
          !line.trim().startsWith('/*') &&
          !line.trim().endsWith('*/') &&
          !line.includes('t(\'') && 
          !line.includes('t("')) {
        issues.push({
          file: filePath,
          line: lineNum + 1,
          content: line.trim()
        });
      }
    }
  });
  
  return issues;
}

function scanDirectory(dir) {
  const allIssues = [];
  
  function scan(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (shouldExcludeFile(fullPath)) {
        continue;
      }
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (stat.isFile() && 
                (fullPath.endsWith('.tsx') || 
                 fullPath.endsWith('.ts') || 
                 fullPath.endsWith('.js') ||
                 fullPath.endsWith('.jsx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const issues = findSpanishStrings(fullPath, content);
          allIssues.push(...issues);
        } catch (error) {
          console.warn(`Error reading ${fullPath}: ${error.message}`);
        }
      }
    }
  }
  
  scan(dir);
  return allIssues;
}

// Ejecutar verificación
console.log('🔍 Iniciando verificación de cadenas hardcodeadas en español...\n');

const projectPath = path.join(__dirname, 'ink-soul-app', 'src');
const issues = scanDirectory(projectPath);

if (issues.length === 0) {
  console.log('✅ ¡Excelente! No se encontraron cadenas hardcodeadas en español.');
  console.log('✅ Todas las traducciones están correctamente implementadas.');
} else {
  console.log('⚠️  Se encontraron cadenas hardcodeadas en español:\n');
  
  issues.forEach(issue => {
    console.log(`📁 ${issue.file}:${issue.line}`);
    console.log(`   ${issue.content}\n`);
  });
  
  console.log(`🔢 Total de problemas encontrados: ${issues.length}`);
  console.log('\n💡 Sugerencias:');
  console.log('   - Revisa cada archivo y convierte las cadenas a claves i18n');
  console.log('   - Asegúrate de que todo texto visible use t() function');
  console.log('   - Añade las traducciones faltantes a i18n.ts');
}

console.log('\n✨ Verificación completada.');
