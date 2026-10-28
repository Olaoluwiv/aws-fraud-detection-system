
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import TransactionDB


app = FastAPI(
    title="VaultGuard API",
    description="Backend API for the VaultGuard fraud detection system",
    version="0.2.0",
)


# Allow the local frontend to call the backend during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Define the expected structure of a transaction.
class Transaction(BaseModel):
    transaction_id: str
    customer: str
    merchant: str
    amount: float = Field(ge=0)
    currency: Literal["USD", "EUR", "NGN", "GBP"]
    type: str
    risk_level: Literal["Low", "Medium", "High"]
    status: str
    location: Literal["Usual", "Unusual"]


class TransactionCreate(BaseModel):
    transaction_id: str
    customer: str
    merchant: str
    amount: float = Field(ge=0)
    currency: Literal["USD", "EUR", "NGN", "GBP"]
    type: str
    status: str
    location: Literal["Usual", "Unusual"]



def calculate_risk(
    amount: float,
    currency: str,
    location: str,
) -> str:
    """Assign a simple demonstration risk level."""

    # Illustrative thresholds for each currency.
    amount_thresholds = {
        "USD": 1000,
        "EUR": 900,
        "NGN": 1500000,
        "GBP": 800,
    }

    score = 0

    # Unusual location adds two risk points.
    if location == "Unusual":
        score += 2

    # A high transaction amount adds one risk point.
    threshold = amount_thresholds.get(currency)

    if threshold is not None and amount >= threshold:
        score += 1

    # Convert the score into a risk level.
    if score >= 2:
        return "High"
    elif score == 1:
        return "Medium"
    else:
        return "Low"



# Define the structure returned by the list endpoint.
class TransactionListResponse(BaseModel):
    count: int
    transactions: list[Transaction]


# Open a database session for each request and close it afterward.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to the VaultGuard API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VaultGuard API",
    }


@app.get(
    "/api/transactions",
    response_model=TransactionListResponse,
)
def get_transactions(db: Session = Depends(get_db)):

    # Retrieve transactions from SQLite instead of a Python list.
    records = db.query(TransactionDB).all()

    return {
        "count": len(records),
        "transactions": [
            {
                "transaction_id": record.transaction_id,
                "customer": record.customer,
                "merchant": record.merchant,
                "amount": record.amount,
                "currency": record.currency,
                "type": record.type,
                "risk_level": record.risk_level,
                "status": record.status,
                "location": record.location,
            }
            for record in records
        ],
    }


@app.get(
    "/api/transactions/{transaction_id}",
    response_model=Transaction,
)
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
):
    # Find one transaction using its ID as the database key.
    record = db.get(TransactionDB, transaction_id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )

    return {
        "transaction_id": record.transaction_id,
        "customer": record.customer,
        "merchant": record.merchant,
        "amount": record.amount,
        "currency": record.currency,
        "type": record.type,
        "risk_level": record.risk_level,
        "status": record.status,
        "location": record.location,
    }


@app.post(
    "/api/transactions",
    response_model=Transaction,
    status_code=201,
)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
):
    # Prevent duplicate transaction IDs.
    existing = db.get(
        TransactionDB,
        transaction.transaction_id,
    )

    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail="Transaction ID already exists",
        )

    # Backend calculates the risk level.
    calculated_risk = calculate_risk(
        amount=transaction.amount,
        currency=transaction.currency,
        location=transaction.location,
    )

    # Create the database record using the calculated risk.
    new_transaction = TransactionDB(
        transaction_id=transaction.transaction_id,
        customer=transaction.customer,
        merchant=transaction.merchant,
        amount=transaction.amount,
        currency=transaction.currency,
        type=transaction.type,
        risk_level=calculated_risk,
        status=transaction.status,
        location=transaction.location,
    )

    try:
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save transaction",
        )

    return {
        "transaction_id": new_transaction.transaction_id,
        "customer": new_transaction.customer,
        "merchant": new_transaction.merchant,
        "amount": new_transaction.amount,
        "currency": new_transaction.currency,
        "type": new_transaction.type,
        "risk_level": new_transaction.risk_level,
        "status": new_transaction.status,
        "location": new_transaction.location,
    }
