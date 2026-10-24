# VaultGuard — Fraud Detection Dashboard

VaultGuard is a fraud monitoring application with a web dashboard, a Python FastAPI backend, and a SQLite database. The project includes Docker and Docker Compose configurations for running the frontend and backend locally.

## Current Features

- Web dashboard for monitoring transactions and fraud alerts.
- FastAPI backend for serving transaction data.
- SQLite database for storing transaction records.
- Transaction API endpoint with risk-level calculations.
- Docker containers for the frontend and backend.
- Docker Compose configuration for running both services together.
- Automated backend tests and GitHub Actions CI.

**Project status:** Running locally with Docker Compose. AWS deployment and trained machine-learning integration are not yet confirmed as complete.

## Technologies

- Frontend: HTML, CSS, JavaScript
- Backend: Python, FastAPI
- Database: SQLite, SQLAlchemy
- Containers: Docker, Docker Compose
- Testing: pytest, HTTPX
- CI/CD: GitHub Actions

## Run the Frontend Locally

1. Open the `frontend` folder in VS Code.
2. Open `index.html` using the Live Server extension, or open the file directly in your browser.

The Docker Compose frontend is available at `http://localhost:8081` when the Compose services are running.

## Run with Docker Compose

Ensure Docker Desktop is running, then open PowerShell in the project root.

Start the services:

```powershell
docker compose up --build -d
```

Check their status:

```powershell
docker compose ps
```

Access the application:

- Frontend: http://localhost:8081
- Backend health check: http://localhost:8001/health
- Transactions API: http://localhost:8001/api/transactions
- Interactive API documentation: http://localhost:8001/docs

To view backend logs:

```powershell
docker compose logs backend
```

To stop the Compose services when you intentionally want to stop them:

```powershell
docker compose down
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API health |
| GET | `/api/transactions` | Retrieve transaction records |
| POST | `/api/transactions` | Submit a transaction |

The API is available on port `8001` on the host when using the current Compose configuration.

## Database Notes

The backend uses SQLite. The current Compose configuration does not mount a persistent database volume. Database persistence across container replacement has not yet been configured and tested.

Back up important database files before making database or container-storage changes.

## Testing and CI

Run backend tests from the project root using the project's Python environment:

```powershell
python -m pytest tests/ -v
```

The GitHub Actions workflow runs backend tests when configured push or pull-request events occur on the `main` branch.

## Important Limitations

- Risk calculations are rule-based; a trained machine-learning model is not confirmed as integrated.
- Currency display does not necessarily perform real currency conversion.
- Fraud-risk results should not be treated as guaranteed or definitive fraud assessments.
- The current project runs locally; production AWS deployment is a future step.

## Planned Next Steps

1. Improve database persistence and backup procedures.
2. Strengthen API testing and security.
3. Use Terraform to provision AWS infrastructure.
4. Plan and implement a secure AWS deployment.
5. Evaluate and integrate a machine-learning model when ready.
