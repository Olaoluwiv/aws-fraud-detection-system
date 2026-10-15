
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Store the database file inside the backend folder.
DATABASE_URL = (
    f"sqlite:///{Path(__file__).resolve().parent / 'vaultguard.db'}"
)

# Create the connection engine.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Create database sessions for reading and writing data.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for database table definitions.
Base = declarative_base()
