
from sqlalchemy import Column, Float, String

from backend.database import Base


class TransactionDB(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    customer = Column(String, nullable=False)
    merchant = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    type = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    status = Column(String, nullable=False)
    location = Column(String, nullable=False)
