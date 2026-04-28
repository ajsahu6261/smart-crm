from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(lambda v: ObjectId(v) if ObjectId.is_valid(v) else v),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda v: str(v)
            ),
        )

class Client(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    email: str
    pan: str
    phone: str
    assigned_staff_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CARecord(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    client_id: str
    client_name: str
    type: str  # itr, gst, tds, audit, billing
    status: str  # Pending, In Progress, Completed
    amount: float = 0.0
    due_date: datetime
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    description: str
    status: str  # Todo, Doing, Done
    assigned_to: str
    client_id: Optional[str] = None
    due_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Document(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    type: str
    url: str
    client_id: str
    uploaded_by: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
