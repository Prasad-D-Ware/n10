# N10 - Visual Workflow Automation Platform

N10 is a powerful visual workflow automation platform that allows users to create, manage, and execute automated workflows through an intuitive drag-and-link interface. Built with modern web technologies, N10 enables seamless integration with popular services like WhatsApp, Telegram, OpenAI, and Resend.

## 🎬 Demo

https://github.com/user-attachments/assets/e8fc18cf-775a-4795-8011-d33919394449

## 🚀 Features

### Visual Workflow Builder

- **Drag-and-Link Interface**: Create workflows using an intuitive visual editor powered by React Flow
- **Real-time Execution**: Watch your workflows execute in real-time with live status updates
- **Node-based Architecture**: Connect triggers and actions through a visual node system
- **Workflow Management**: Save, edit, enable/disable workflows with ease

### Supported Integrations

- **Telegram Bot API**: Send messages through Telegram bots
- **Resend For GMAIL**: Send transactional emails
- **WhatsApp Business API**: Send messages via WhatsApp Business
- **OpenAI API**: Integrate AI capabilities into your workflows
- **Solana**: Store wallet credentials (private key) for use in Solana actions
- **AI Agent**: Advanced AI agent capabilities (in development)

### Triggers

- **Manual Trigger**: Execute workflows manually from the dashboard
- **Webhook Trigger**: Trigger workflows via HTTP webhooks
- **Real-time Execution**: Live execution monitoring with status updates

### User Management

- **Authentication**: Secure user registration and login
- **Credential Management**: Securely store and manage API credentials
- **User Dashboard**: Comprehensive analytics and workflow overview

### Analytics & Monitoring

- **Execution Analytics**: Track successful and failed executions
- **Performance Metrics**: Monitor average execution times
- **Real-time Status**: Live execution status updates
- **Workflow Statistics**: Comprehensive workflow performance data

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Bun runtime, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI, Lucide React icons
- **Workflow Engine**: Custom execution engine with real-time updates
- **Monorepo**: Turborepo for efficient development

### Project Structure

```text
n10/
├── apps/
│   ├── frontend/          # React frontend application
│   └── backend/           # Bun/Express backend API
├── packages/
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── turbo.json           # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun 1.2.16+
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd n10
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `apps/backend` directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/n10"
   JWT_SECRET="your-jwt-secret"
   ```

   Optionally, in `apps/frontend`, create a `.env` file to point to your backend (defaults to `http://localhost:3000`):

   ```env
   VITE_BACKEND_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   cd apps/backend
   bun prisma migrate dev
   bun prisma generate
   ```

5. **Start the development servers**

   ```bash
   # From the root directory
   bun run dev
   ```

   This will start:

   - Frontend: <http://localhost:5173>
   - Backend: <http://localhost:3000>

## 📖 Usage Guide

### Creating Your First Workflow

1. **Sign Up/Login**: Create an account or login to access the dashboard
2. **Add Credentials**: Go to Settings to add API credentials for your integrations
3. **Create Workflow**: Navigate to Workflows and click "Create New"
4. **Add Trigger**: Choose how your workflow should be triggered (Manual or Webhook)
5. **Add Actions**: Drag and drop action nodes for your integrations
6. **Configure Nodes**: Click on each node to configure settings and select credentials
7. **Save & Enable**: Save your workflow and enable it for execution

### Supported Actions


#### Telegram

- Send messages via Telegram bot
- Requires BotFather token

#### Email (Resend)

- Send transactional emails
- Requires Resend API key

#### OpenAI

- Integrate AI capabilities
- Requires OpenAI API key

#### WhatsApp

- Send text messages to WhatsApp Business numbers
- Requires Meta Business API credentials


### Webhook Integration

1. Create a workflow with a webhook trigger
2. Save the workflow to get the webhook URL
3. Use the webhook URL to trigger workflows from external systems
4. Webhook URL format: `https://your-domain.com/api/v1/webhook/{workflow-id}`

## 🔧 API Reference

Base path: `/api/v1`

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Workflow Endpoints

- `GET /api/v1/workflows` - Get all user workflows
- `POST /api/v1/workflows/create` - Create new workflow
- `PUT /api/v1/workflows/:id` - Update workflow
- `GET /api/v1/workflows/:id` - Get specific workflow
- `DELETE /api/v1/workflows/:id` - Delete workflow

### Execution Endpoints

- `POST /api/v1/execute` - Execute workflow manually
- `GET /api/v1/execute` - Get recent executions
- `GET /api/v1/execute/stream` - Stream execution updates (SSE)
- `POST /api/v1/webhook/:workflowId` - Trigger workflow via webhook

### Credential Endpoints

- `GET /api/v1/credentials` - Get user credentials
- `POST /api/v1/credentials/create` - Create new credential
- `PUT /api/v1/credentials/:id` - Update credential
- `DELETE /api/v1/credentials/:id` - Delete credential

### Available Trigger Endpoints

- `GET /api/v1/availableTrigger` - List available triggers
- `POST /api/v1/availableTrigger` - Create/register a trigger

### Analytics Endpoints

- `GET /api/v1/analytics` - Get user analytics data

## 🛠️ Development

### Building for Production

```bash
bun run build
```

### Database Management

```bash
# Generate Prisma client
bun prisma generate

# Run migrations
bun prisma migrate dev

# Reset database
bun prisma migrate reset
```

### Code Quality

```bash
# Lint code
bun run lint

# Format code
bun run format

# Type checking
bun run check-types
```

## 🚀 Deployment

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy both frontend and backend

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for backend
FROM oven/bun:1.2.16
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```
