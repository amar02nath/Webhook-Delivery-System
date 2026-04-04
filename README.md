# Webhook Delivery Engine

A robust, full-stack, production-ready Webhook Delivery Engine designed with a distributed architecture using Node.js, Express, MongoDB, Redis, BullMQ, and React.

This application acts as a central hub to manage, deliver, and monitor webhooks across different services, mimicking industry-standard webhook infrastructure like Stripe or GitHub.

---

## 🌟 Core Functionalities & Features

### 1. Reliable Delivery & Retry Mechanism
- **Distributed Queuing:** Built with BullMQ and Redis to offload HTTP requests into background jobs, minimizing latency for the primary API server.
- **Exponential Backoff:** Configured to automatically retry failed webhook deliveries using an intelligent exponential backoff strategy.
- **Timeout Management:** Webhook delivery requests enforce a strict 5-second timeout (`AbortSignal.timeout`) to prevent hung requests and resource exhaustion.

### 2. Security First
- **Cryptographic Signatures:** Every delivery attempt automatically generates an HMAC signature (`X-Webhook-Signature`) using a secret generated for the endpoint, ensuring the receiving server can verify the payload's authenticity.
- **Attempt Tracking:** Injects the header `X-Webhook-Attempt` with every dispatch so clients know exactly which retry attempt they are receiving.

### 3. Monitoring & Analytics
- **Health Tracking:** Automatically updates endpoint status to `healthy` or `failing` depending on the success or max-retries limit of delivered payloads.
- **Detailed Delivery Logs:** Extensive logs are kept for each payload delivery, capturing the HTTP status code, accurate response time measurements, detailed error messages, and exact payload schemas.

### 4. Admin Dashboard (React Frontend)
- **Manage Endpoints:** Intuitive UI to Create, Read, Update, and Delete (CRUD) webhook endpoints.
- **Event Scoping:** Map specific business events (e.g., `order.created`, `payment.failed`) to individual endpoints.
- **Live Monitoring & Logs:** Granular `LogTable` view to inspect exact payloads delivered and manual triggers for retrying single failed deliveries right from the UI.
- **Trigger Test Events:** Easily simulate events from the dashboard without needing to interact with your source applications.

---

## 🛠 Tech Stack

**Backend**
- **Node.js & Express:** REST API architecture.
- **MongoDB & Mongoose:** Data persistence for Endpoints and Delivery Logs.
- **Redis & BullMQ:** Distributed queue and robust background job processing.

**Frontend**
- **React.js (Vite):** Blazing fast interactive user interface.
- **TailwindCSS / Vanilla CSS:** Custom styled application interface utilizing robust component hierarchies (`Navbar`, `EndpointCard`, `AddEndpointModal`, `LogTable`).

---

## ⚙️ Implementation Process & Architecture

The application is clearly decoupled, separating frontend administration components from backend robust webhook delivery operations.

### Backend Process Flow:
1. **Event Reception (`eventCtrl.js`):** A client or microservice hits the `/api/events/trigger` API endpoint with an event name and payload.
2. **Endpoint Resolution:** The controller queries MongoDB for all registered webhook URLs subscribed to that specific system event.
3. **Queue Ingestion (`queue.js`):** A BullMQ job is immediately enqueued inside Redis for each matching endpoint.
4. **Background Delivery (`deliveryWorker.js`):** The isolated worker picks up the job, and executes the sequence:
   - Signs the payload leveraging the endpoint's unique cryptographic `secret`.
   - Executes an HTTP `POST` request to the destination URL attached with custom Headers.
   - Restricts long-running jobs via a strict 5000ms fetch abort timeout.
5. **Database Updates:** Modifies the specific `DeliveryLog` and resolves the overarching `Endpoint` health status based directly off the destination's HTTP response codes. If the request fails, it throws a localized error back to BullMQ, prompting an automatic exponential retry.
6. **Manual Fallback Retry:** Provides an auxiliary fallback API to push historically failed `DeliveryLogs` directly back onto the active `webhook-delivery` queue via `/api/events/retry/:logId`.

### Frontend Component Architecture:
- `Dashboard`: High-level overview of all recorded webhook endpoints. Orchestrates grids of `EndpointCard` elements summarizing target status metrics.
- `EndpointDetails`: Extensive drill-down view. Programmatically fetches and plots chronological `DeliveryLogs` attached to an endpoint ID inside the `LogTable`.
- `AddEndpointModal`: Modal flow handling creation and routing dependencies of new webhook endpoints.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or running inside Docker on port `27017`)
- **Redis** (Local instance or running inside Docker on port `6379`)

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a `.env` file in the `backend` directory
cat <<EOT >> .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/webhook_engine
REDIS_URL=redis://localhost:6379
EOT

# Start the server (Dev Mode with nodemon)
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server (Vite)
npm run dev
```

### 3. Test Receiver Setup

To test the webhooks locally, you will need a third terminal dedicated to running the test receiver script.

```bash
# From the root directory of the project
# Start the bare-bones Express webhook receiver
node test-receiver.js
```
*This server will listen on `http://localhost:4000/webhook` and print incoming payloads to your terminal.*

---

## 🎮 Usage Guide

1. **Test Receiver**: Before beginning, optionally start the bare-bones Express webhook receiver designed specifically for local testing: `node test-receiver.js` (Root directory). It will run on `http://localhost:4000`.
2. **Add an Endpoint**: Navigate to the React dashboard (`http://localhost:5173`) and click Add Endpoint to map the `http://localhost:4000/webhook` target URL to an event (e.g., `order.created`).
3. **Trigger Event**: Press **"Trigger Test Event"** from the active dashboard.
4. **Monitor Deliveries**: Click into the specific Endpoint Details view to oversee exhaustive delivery logs detailing round-trip latency, individual attempt counts, raw JSON payloads, and success codes! 
5. **Retry Failed Work**: If the target server goes offline, subsequently simulate returning it online. Find a failed webhook log record on the logs page and intuitively hit "Retry" to manually recycle the failing outbound request.

---

## 📁 Project Structure

```text
webhook-engine/
├── test-receiver.js        # Helper script to intercept and log test webhooks natively
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB initializations
│   │   ├── controllers/    # API Logic layer (eventCtrl, endpointCtrl)
│   │   ├── models/         # ODM Schemas via Mongoose (Endpoint, DeliveryLog)
│   │   ├── routes/         # Express unified API router handling
│   │   ├── services/       # Cryptographic functions and helpers (HMAC)
│   │   ├── workers/        # BullMQ isolated background thread handlers
│   │   └── server.js       # Express core application entry block
│   ├── .env                # App Environment specifics  
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # UI Composition Blocks (Cards, Table Logs)
    │   ├── pages/          # Distinct views contextually mapped (Dashboard)
    │   ├── services/       # Network API interceptors/fetch wrapper utilities
    │   ├── App.jsx         # React primary parent layout routing container
    │   └── index.css       # Tailwind/Vanilla style injection configuration 
    └── package.json
```
#   W e b h o o k - D e l i v e r y - S y s t e m  
 