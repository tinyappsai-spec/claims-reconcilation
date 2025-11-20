# Claims Reconciliation System

Unified platform for reconciling healthcare claims and invoices. This project includes both a FastAPI backend and a React frontend.

---

## Docker Setup

You can run both frontend and backend using Docker Compose:

```bash
docker-compose up --build
```

Generate Sample CSVs
Windows:

powershell

mkdir C:\docker-output
docker run --rm -e HOST_OUTPUT_DIR=/host -v C:\docker-output:/host claims-reconciliation-backend python /app/data/generate_data.py

Mac/Linux:

mkdir -p ~/docker-output
docker run --rm -e HOST_OUTPUT_DIR=/host -v ~/docker-output:/host claims-reconciliation-backend python /app/data/generate_data.py
CSV files will be saved to the mapped host folder.

---

start app by opening http://localhost:3000 in your browser

## Backend (FastAPI)

Backend service for the **Claims Reconciliation System** built with **FastAPI**.
It supports uploading CSV files, reconciling claims with invoices, and returning summary statistics.
All operations are **in-memory**, making it lightweight and ideal for local testing.

### Requirements

- Python 3.11+
- pip
- Docker (optional, for containerized setup)

### Setup & Run Locally

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd claims-reconciliation/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # macOS/Linux
   source .venv/bin/activate
   # Windows PowerShell
   .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

---

## Frontend (React)

### Dependencies Used

- **React**: UI library
- **TypeScript**: Type safety
- **Material UI (@mui/material, @mui/icons-material, @mui/x-data-grid)**: UI components and icons
- **Axios**: HTTP client for API requests
- **PapaParse**: CSV parsing
- **React Hook Form**: Form management
- **Recharts**: Charting library

### State Management

This project uses the React Context API as a lightweight way to manage state, avoiding the extra setup and complexity of Redux for a project of this size.

Global State: Context is used only for "server state" (data fetched from the backend). This gives a single source of truth for important app data.

Local State: Individual UI components manage their own temporary state. Keeping this separate prevents unnecessary global updates and helps the app stay fast and responsive.

### Scripts

- `npm start`: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm run eject`: **Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## License

MIT
