from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
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

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = Field(..., description="Role must be admin, staff, or client")

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
