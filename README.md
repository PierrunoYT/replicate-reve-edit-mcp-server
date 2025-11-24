# Reve Edit MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io/)
[![Replicate](https://img.shields.io/badge/Replicate-Reve%20Edit-green)](https://replicate.com/reve/edit)

A Model Context Protocol (MCP) server that provides access to Reve Edit - an image editing model from Reve that transforms existing images using natural language while preserving spatial relationships, lighting, and overall structure.

**🔗 Repository**: [https://github.com/PierrunoYT/replicate-reve-edit-mcp-server](https://github.com/PierrunoYT/replicate-reve-edit-mcp-server)

> **🚀 Ready to use!** Pre-built executable included - no compilation required.
>
> **✅ Enhanced Reliability**: Server handles missing API keys gracefully without crashes and includes robust error handling.

## Features

- **Spatial Intelligence**: The model understands depth, perspective, and how objects interact in three-dimensional space
- **Composition Preservation**: When you modify parts of an image, everything else adjusts appropriately - shadows, lighting, and reflections stay consistent
- **Prompt Adherence**: The model follows your instructions closely, making specific edits without randomly altering other parts
- **Aesthetic Quality**: Outputs maintain professional-looking results with proper texture, material rendering, and visual coherence
- **Natural Language Editing**: Edit images using simple text descriptions - no complex commands needed
- **Automatic Image Download**: Edited images are automatically saved to local `images` directory
- **Version Control**: Specify model version (latest or specific version hash)
- **Detailed Responses**: Returns both local file paths and original URLs
- **Robust Error Handling**: Graceful handling of missing API keys without server crashes
- **Universal Portability**: Works anywhere with npx - no local installation required
- **Enhanced Reliability**: Graceful shutdown handlers and comprehensive error reporting

## Prerequisites

- Node.js 18 or higher
- Replicate API token

## Installation

### 1. Get your Replicate API Token

- Visit [Replicate](https://replicate.com/)
- Sign up for an account
- Navigate to [Account API Tokens](https://replicate.com/account/api-tokens)
- Generate an API token

### 2. Clone or Download

```bash
git clone https://github.com/PierrunoYT/replicate-reve-edit-mcp-server.git
cd replicate-reve-edit-mcp-server
```

### 3. Install Dependencies (Optional)

The server is pre-built, but if you want to modify it:

```bash
npm install
npm run build
```

## Configuration

### 🚀 Recommended: Universal npx Configuration (Works Everywhere)

**Best option for portability** - works on any machine with Node.js:

```json
{
  "mcpServers": {
    "reve-edit": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/PierrunoYT/replicate-reve-edit-mcp-server.git"
      ],
      "env": {
        "REPLICATE_API_TOKEN": "your-replicate-api-token-here"
      }
    }
  }
}
```

**Benefits:**
- ✅ **Universal Access**: Works on any machine with Node.js
- ✅ **No Local Installation**: npx downloads and runs automatically
- ✅ **Always Latest Version**: Pulls from GitHub repository
- ✅ **Cross-Platform**: Windows, macOS, Linux compatible
- ✅ **Settings Sync**: Works everywhere you use your MCP client

### Alternative: Local Installation

If you prefer to install locally, use the path helper:

```bash
npm run get-path
```

This will output the complete MCP configuration with the correct absolute path.

#### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "reve-edit": {
      "command": "node",
      "args": ["path/to/replicate-reve-edit-mcp-server/build/index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "your-replicate-api-token-here"
      }
    }
  }
}
```

#### For Kilo Code MCP Settings

Add to your MCP settings file at:
`C:\Users\[username]\AppData\Roaming\Kilo-Code\MCP\settings\mcp_settings.json`

```json
{
  "mcpServers": {
    "reve-edit": {
      "command": "node",
      "args": ["path/to/replicate-reve-edit-mcp-server/build/index.js"],
      "env": {
        "REPLICATE_API_TOKEN": "your-replicate-api-token-here"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Available Tools

### `reve_edit`

Edit images using Reve Edit model from Replicate. Transform existing images using natural language while preserving spatial relationships, lighting, and overall structure.

**Parameters:**
- `image` (required): Image file path or URL to edit (format: uri)
- `prompt` (required): Text instruction describing how to edit the image
- `version` (optional): The specific model version to use (e.g., "latest" or a version hash) (default: "latest")

**Response includes:**
- Image URL for immediate access
- Local file path for downloaded image
- Editing parameters used

**Use Cases:**
- **Product Photography**: Update product colors, swap backgrounds, or adjust lighting without reshooting
- **Photo Restoration**: Remove unwanted elements, fix lighting issues, or restore damaged areas
- **Landscape Editing**: Change weather conditions, adjust time of day, or modify natural elements
- **Creative Iteration**: Quickly explore different visual directions from a single starting image
- **Character Consistency**: Edit images of people or characters while maintaining their unique features

## 📥 **How Image Download Works**

The Reve Edit MCP server automatically downloads edited images to your local machine. Here's the complete process:

### **1. Image Editing Flow**
1. **API Call**: Server calls Replicate's Reve Edit API
2. **Response**: Replicate returns temporary URLs for edited images
3. **Auto-Download**: Server immediately downloads images to local storage
4. **Response**: Returns both local paths and original URLs

### **2. Download Implementation**

#### **Download Function** ([`downloadImage`](src/index.ts:37-71)):
```typescript
async function downloadImage(url: string, filename: string): Promise<string> {
  // 1. Parse the URL and determine HTTP/HTTPS client
  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === 'https:' ? https : http;
  
  // 2. Create 'images' directory if it doesn't exist
  const imagesDir = path.join(process.cwd(), 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // 3. Create file write stream
  const filePath = path.join(imagesDir, filename);
  const file = fs.createWriteStream(filePath);
  
  // 4. Download and pipe to file
  client.get(url, (response) => {
    response.pipe(file);
    // Handle completion and errors
  });
}
```

#### **Filename Generation** ([`generateImageFilename`](src/index.ts:67-77)):
```typescript
function generateImageFilename(prompt: string, index: number): string {
  // Creates safe filename: reve_edit_prompt_index_timestamp.png
  const safePrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/\s+/g, '_')         // Replace spaces with underscores
    .substring(0, 50);            // Limit length
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `reve_edit_${safePrompt}_${index}_${timestamp}.png`;
}
```

### **3. File Storage Details**

#### **Directory Structure:**
```
your-project/
├── images/                    # Auto-created directory
│   ├── reve_edit_add_sunset_colors_1_2025-06-24T18-30-45-123Z.png
│   ├── reve_edit_remove_person_left_1_2025-06-24T18-31-20-456Z.png
│   └── ...
```

#### **Filename Format:**
- **Prefix**: `reve_edit_`
- **Prompt**: First 50 chars, sanitized (alphanumeric + underscores)
- **Index**: Image number
- **Timestamp**: ISO timestamp for uniqueness
- **Extension**: `.png` (Replicate returns PNG format)

### **4. Response Format**

The server returns both local and remote information:
```
Successfully edited image using Reve Edit:

Prompt: "add the word edit in a funky font in the middle center in white text"
Version: latest
Input Image: https://replicate.delivery/pbxt/...

Edited Image:
  Original URL: https://replicate.delivery/xezq/...
  Local Path: /path/to/project/images/reve_edit_add_the_word_edit_1_2025-06-24T18-30-45-123Z.png

Edited image has been downloaded to the local 'images' directory.
```

## Example Usage

### Basic Image Editing
```
Edit an image:
- Image: https://example.com/photo.jpg
- Prompt: "Add 'edit' in the middle of this image in a modern font, white text"
```

### Product Photography Editing
```
Edit an image:
- Image: /path/to/product.jpg
- Prompt: "Change the background to a modern office setting"
```

### Photo Restoration
```
Edit an image:
- Image: https://example.com/old-photo.jpg
- Prompt: "Remove the person on the left side and fix the lighting"
```

### Landscape Editing
```
Edit an image:
- Image: /path/to/landscape.jpg
- Prompt: "Change the sky to sunset colors"
```

### Creative Iteration
```
Edit an image:
- Image: https://example.com/portrait.jpg
- Prompt: "Keep the image exactly the same, do not dim it, add the word edit in a funky font in the middle center in white text"
```

### Advanced Editing
```
Edit an image:
- Image: /path/to/image.png
- Prompt: "Replace the background with a futuristic cityscape at night, adjust the subject's lighting to match"
- Version: latest
```

## Technical Details

### Architecture
- **Language**: TypeScript with ES2022 target
- **Runtime**: Node.js 18+ with ES modules
- **Protocol**: Model Context Protocol (MCP) SDK v1.0.0
- **API Client**: Replicate JavaScript client
- **Validation**: Zod schema validation

### API Endpoints Used
- **Image Editing**: `reve/edit` model via Replicate API

### Error Handling
- **Graceful API key handling**: Server continues running even without REPLICATE_API_TOKEN set
- **No crash failures**: Removed `process.exit()` calls that caused connection drops
- **Null safety checks**: All tools validate API client availability before execution
- **Graceful shutdown**: Proper SIGINT and SIGTERM signal handling
- **API error catching**: Comprehensive error reporting with detailed context
- **User-friendly messages**: Clear error descriptions instead of technical crashes

## Development

### Project Structure
```
├── src/
│   └── index.ts          # Main MCP server implementation
├── build/                # Compiled JavaScript (ready to use)
├── test-server.js        # Server testing utility
├── get-path.js          # Configuration path helper
├── example-mcp-config.json # Example configuration
├── package.json         # Project metadata and dependencies
└── tsconfig.json        # TypeScript configuration
```

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run start` - Start the server directly
- `npm run test` - Test server startup and basic functionality
- `npm run get-path` - Get configuration path for your system

### Making Changes
1. Edit files in the `src/` directory
2. Run `npm run build` to compile
3. Restart your MCP client to use the updated server

### Testing
```bash
npm run test
```

This runs a basic connectivity test that verifies:
- Server starts correctly
- MCP protocol initialization
- Tool discovery functionality

## API Costs

This server uses the Replicate platform, which charges per image editing operation. Check [Replicate pricing](https://replicate.com/pricing) for current rates.

**Typical costs**:
- Reve Edit: Check [Replicate pricing](https://replicate.com/pricing) for current rates
- Costs vary by model version and complexity
- Visit [Replicate Reve Edit page](https://replicate.com/reve/edit) for detailed pricing

## Troubleshooting

### Server not appearing in MCP client
1. **Recommended**: Use the npx configuration for universal compatibility
2. If using local installation, verify the path to `build/index.js` is correct and absolute
3. Ensure Node.js 18+ is installed: `node --version`
4. Test server startup: `npm run test`
5. Restart your MCP client (Claude Desktop, Kilo Code, etc.)
6. **Note**: Server will start successfully even without REPLICATE_API_TOKEN - check tool responses for API token errors

### Image editing failing
1. Verify your Replicate API token is valid and has sufficient credits
2. Check that your prompt follows Replicate's content policy
3. Ensure both `image` and `prompt` parameters are provided
4. Verify the image URL or path is accessible
5. Try simplifying the prompt or being more specific about the edits
6. Check the server logs for detailed error messages
7. Ensure the Reve Edit model is available: [replicate.com/reve/edit](https://replicate.com/reve/edit)
8. Verify your account has sufficient balance on Replicate

### Build issues
If you need to rebuild the server:
```bash
npm install
npm run build
```

### Configuration issues
Use the helper script to get the correct path:
```bash
npm run get-path
```

## Support

For issues with:
- **This MCP server**: Create an issue in this repository
- **Replicate API**: Check [Replicate documentation](https://replicate.com/docs)
- **Reve Edit Model**: Visit [Replicate Reve Edit page](https://replicate.com/reve/edit)
- **MCP Protocol**: See [MCP documentation](https://modelcontextprotocol.io/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run test`
5. Submit a pull request

## Changelog

### v1.0.0
- **🚀 Initial release**: Reve Edit support via Replicate
- **📥 Automatic image download**: Edited images are automatically saved to local `images` directory
- **🗂️ Smart filename generation**: Images saved with descriptive names including prompt and timestamp
- **🔄 Enhanced responses**: Returns both local file paths and original URLs for maximum flexibility
- **📁 Auto-directory creation**: Creates `images` folder automatically if it doesn't exist
- **🛡️ Download error handling**: Graceful fallback to original URLs if local download fails
- **🎨 Spatial intelligence**: Model understands depth, perspective, and object interactions
- **⚙️ Comprehensive controls**: Full parameter support including image, prompt, and version
- **🖼️ Natural language editing**: Edit images using simple text descriptions
- **🔧 Robust error handling**: Graceful shutdown handlers and comprehensive error reporting
- **🌍 Universal portability**: Works everywhere with npx configuration