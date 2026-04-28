from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.records import Client, CARecord, Task, Document
from api.auth import get_current_user
from core.database import get_database
from models.user import UserResponse
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# --- Clients ---
@router.get("/clients", response_model=List[Client])
async def get_clients(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    if current_user.role == "admin":
        clients = await db.clients.find().to_list(1000)
    else:
        # Staff only see assigned clients
        clients = await db.clients.find({"assigned_staff_id": str(current_user.id)}).to_list(1000)
    return clients

@router.post("/clients", response_model=Client)
async def create_client(client: Client, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    client_dict = client.model_dump(by_alias=True)
    if "_id" in client_dict and isinstance(client_dict["_id"], str):
        client_dict["_id"] = ObjectId(client_dict["_id"])
    await db.clients.insert_one(client_dict)
    return client

@router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client: Client, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    client_dict = client.model_dump(by_alias=True)
    client_dict.pop("_id", None)
    await db.clients.update_one({"_id": ObjectId(client_id)}, {"$set": client_dict})
    return client

@router.delete("/clients/{client_id}")
async def delete_client(client_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    await db.clients.delete_one({"_id": ObjectId(client_id)})
    return {"message": "Client deleted"}

# --- CA Records (ITR, GST, etc.) ---
@router.get("/records/{record_type}", response_model=List[CARecord])
async def get_records(record_type: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    query = {"type": record_type}
    
    if current_user.role == "client":
        query["client_id"] = str(current_user.id)
    elif current_user.role == "staff":
        assigned_clients = await db.clients.find({"assigned_staff_id": str(current_user.id)}).to_list(1000)
        client_ids = [str(c["_id"]) for c in assigned_clients]
        query["client_id"] = {"$in": client_ids}
    
    records = await db.records.find(query).to_list(1000)
    return records

@router.post("/records", response_model=CARecord)
async def create_record(record: CARecord, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    record_dict = record.model_dump(by_alias=True)
    if "_id" in record_dict and isinstance(record_dict["_id"], str):
        record_dict["_id"] = ObjectId(record_dict["_id"])
    await db.records.insert_one(record_dict)
    return record

@router.put("/records/{record_id}", response_model=CARecord)
async def update_record(record_id: str, record: CARecord, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    record_dict = record.model_dump(by_alias=True)
    record_dict.pop("_id", None)
    await db.records.update_one({"_id": ObjectId(record_id)}, {"$set": record_dict})
    return record

@router.delete("/records/{record_id}")
async def delete_record(record_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    await db.records.delete_one({"_id": ObjectId(record_id)})
    return {"message": "Record deleted"}

# --- Tasks ---
@router.get("/tasks", response_model=List[Task])
async def get_tasks(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    if current_user.role == "admin":
        tasks = await db.tasks.find().to_list(1000)
    else:
        tasks = await db.tasks.find({"assigned_to": current_user.email}).to_list(1000)
    return tasks

@router.post("/tasks", response_model=Task)
async def create_task(task: Task, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db = get_database()
    task_dict = task.model_dump(by_alias=True)
    if "_id" in task_dict and isinstance(task_dict["_id"], str):
        task_dict["_id"] = ObjectId(task_dict["_id"])
    await db.tasks.insert_one(task_dict)
    return task

# --- Documents ---
@router.get("/documents", response_model=List[Document])
async def get_documents(client_id: str = None, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    query = {}
    if client_id:
        query["client_id"] = client_id
    elif current_user.role == "client":
        query["client_id"] = str(current_user.id)
        
    documents = await db.documents.find(query).to_list(1000)
    return documents

@router.post("/documents", response_model=Document)
async def create_document(doc: Document, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    doc_dict = doc.model_dump(by_alias=True)
    if "_id" in doc_dict and isinstance(doc_dict["_id"], str):
        doc_dict["_id"] = ObjectId(doc_dict["_id"])
    await db.documents.insert_one(doc_dict)
    return doc

