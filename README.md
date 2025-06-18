# CharacterPlus: Build Character AI with Memory Using Letta

<div align="center">
  
  ### 🚀 [Try the app!](https://v0.dev/chat/characterplus-project-4d7WsE1OJeb)
  
  [**v0 Transcript**](https://v0.dev/chat/characterplus-project-4d7WsE1OJeb) • 
  [**Watch on YouTube**](https://www.youtube.com/@letta-ai) • 
  [**Try Letta Cloud**](https://app.letta.com) • 
  [**Meetup Series**](https://lu.ma/letta)
  
</div>

<img width="1103" alt="CharacterPlus Screenshot" src="https://github.com/user-attachments/assets/7977e40a-e0f3-4113-b4e6-d42c7543981c" />

## Overview

CharacterPlus is a **Character AI–style web application** that enables conversations with fully-fledged **stateful agents** powered by [Letta](https://docs.letta.com).

### Key Features
- **Persistent Memory**: Each character maintains long-term memory across conversations
- **Shared User Profile**: Characters share knowledge about you through a common memory block
- **Tool-Calling Capabilities**: Agents can perform actions beyond just chatting
- **REST API Integration**: Built-in endpoints compatible with Python and TypeScript/Node.js SDKs

> Built during the ["Stateful Agents Vibecoding" meetup](https://lu.ma/letta) using [Vercel v0](https://v0.dev).

## How It Works

### 1. Connect to Your Letta Server

Click the ⚙️ **Settings** icon and enter your [Letta Cloud API key](https://docs.letta.com/guides/cloud/letta-api-key).

**Using Self-Hosted Letta?**
- Replace `api.letta.com` in the source code with your server's IP address
- Use your server password as the API key (or a dummy value if not password-protected)

### 2. Customize Your Profile

Click the 👤 **Profile** icon to edit your `human` memory block. This [shared memory block](https://docs.letta.com/guides/agents/multi-agent-shared-memory) contains information about you that all characters can access.

<img width="421" alt="Profile Editor" src="https://github.com/user-attachments/assets/89719c5c-95f0-4487-bb02-11f840d10971" />

**How Memory Works:**
- **Shared Memory**: When one character learns something about you, all characters receive that information
- **Private Memory**: Each character has their own persona and individual memories
- **Character Personas**: Pre-defined in [`/lib/characters.json`](/lib/characters.json)

### 3. Chat with Characters

<img width="702" alt="Chat Interface" src="https://github.com/user-attachments/assets/24d029f2-684a-4ae4-80c5-d62fe9248216" />

**Character States:**
- **Active**: Agent exists and will resume previous conversations
- **New**: Agent will be created on first interaction

**Actions:**
- **Chat Now**: Start or resume a conversation
- **🔁 Reset**: Delete the character's memory and start fresh

### 4. Manage Characters in the ADE

View and manage your characters in the [Letta Agent Development Environment](https://app.letta.com):

<img width="1437" alt="Letta ADE" src="https://github.com/user-attachments/assets/27352a08-4fbb-4671-a2b0-d7c47f36e473" />

Characters created by the app are prefixed with `character_*`.

## Quick Start

### Option 1: Deploy on Vercel

1. Visit the [v0 project link](https://v0.dev/chat/characterplus-project-4d7WsE1OJeb)
2. Click "Deploy" to create your own live version
3. Share with friends or preview in the v0 window

### Option 2: Run Locally

**Prerequisites:**
- Node.js 18.17 or later
- A package manager (npm, yarn, or pnpm)

```bash
# Clone the repository
git clone https://github.com/letta-ai/characterai-memory.git
cd characterai-memory

# Install dependencies
npm install         # or yarn / pnpm install

# Set up environment variables
# Create a .env.local file with your Letta API key
echo "LETTA_API_KEY=sk-ltta-..." > .env.local

# Start the development server
npm run dev         # or yarn dev / pnpm dev

# Open http://localhost:3000 in your browser
```

**Note:** v0 projects use Next.js 14+ with the App Router by default. If you encounter any issues, ensure your Node.js version meets the requirements.

## Production Considerations

### Authentication (Required for Production)

The current demo uses your personal Letta Cloud API key, which isn't suitable for multi-user applications. For production deployment, implement user authentication using Letta's **identity system**:

- Each end-user should have a unique identity
- Agents are associated with user identities, not your developer account
- Modify agent creation and listing API calls to include identity parameters

📚 Learn more about [multi-user support in Letta](https://docs.letta.com/guides/agents/multi-user).

## Contributing

We welcome contributions! Feel free to:
- Improve the UI/UX
- Enhance memory management features
- Add new demo characters
- Fix bugs or improve documentation

**Join the Community**: Chat with the Letta team and other developers on [Discord](https://discord.gg/letta).

## License

[Add your license information here]

---

Built with ❤️ using [Letta](https://letta.com) and [Vercel v0](https://v0.dev)
