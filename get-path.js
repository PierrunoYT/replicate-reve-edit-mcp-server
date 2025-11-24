#!/usr/bin/env node

// Simple script to get the absolute path for MCP configuration
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'build', 'index.js');
// Note: This path is for local installation. For universal portability, use the npx configuration above.

console.log('=== Reve Edit MCP Server Configuration ===\n');
console.log('🎨 Image Editing with Reve Edit\n');

console.log('🚀 Universal npx Configuration (Works Everywhere)\n');

const config = {
  "mcpServers": {
    "reve-edit": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/PierrunoYT/replicate-reve-edit-mcp-server.git"
      ],
      "env": {
        "REPLICATE_API_TOKEN": "YOUR_REPLICATE_API_TOKEN_HERE"
      }
    }
  }
};

console.log(JSON.stringify(config, null, 2));

console.log('\n=== Available Tools ===');
console.log('📸 reve_edit - Edit images using natural language prompts');

console.log('\n=== Instructions ===');
console.log('1. Get your Replicate API token from https://replicate.com/account/api-tokens');
console.log('2. Replace "YOUR_REPLICATE_API_TOKEN_HERE" with your actual API token');
console.log('3. Add this configuration to your MCP settings file');
console.log('4. Restart your MCP client');
console.log('\n✅ Benefits of npx configuration:');
console.log('  • Works on any machine with Node.js');
console.log('  • No local installation required');
console.log('  • Always uses the latest version');
console.log('  • Cross-platform compatible');
console.log('\n🎨 Reve Edit Features:');
console.log('  • Image editing model from Reve');
console.log('  • Spatial intelligence - understands depth and perspective');
console.log('  • Composition preservation - maintains spatial relationships');
console.log('  • Natural language editing - simple text descriptions');
console.log('  • Professional aesthetic quality');
console.log('  • Preserves lighting and structure');