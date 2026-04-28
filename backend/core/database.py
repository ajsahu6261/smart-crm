from motor.motor_asyncio import AsyncIOMotorClient
from mongomock_motor import AsyncMongoMockClient
from .config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class Database:
    client = None

db = Database()

async def connect_to_mongo():
    try:
        # Use mock client for testing to avoid connection hangs
        db.client = AsyncMongoMockClient()
        logger.info("Using AsyncMongoMockClient for MongoDB connection.")
        
        # Seed initial data for mock db since it's in-memory
        await seed_mock_db(db.client[settings.DATABASE_NAME])
    except Exception as e:
        logger.error(f"Error connecting to DB: {e}")

async def seed_mock_db(database):
    from core.security import get_password_hash
    # Seed mock db with users
    if not await database.users.find_one({"email": "admin@cafirm.com"}):
        admin_id = await database.users.insert_one({
            "email": "admin@cafirm.com",
            "full_name": "System Admin",
            "role": "admin",
            "hashed_password": get_password_hash("admin123")
        })

    if not await database.users.find_one({"email": "staff@cafirm.com"}):
        staff_result = await database.users.insert_one({
            "email": "staff@cafirm.com",
            "full_name": "Jane Staff",
            "role": "staff",
            "hashed_password": get_password_hash("staff123")
        })
        staff_id = str(staff_result.inserted_id)
    else:
        staff_user = await database.users.find_one({"email": "staff@cafirm.com"})
        staff_id = str(staff_user["_id"])

    if not await database.users.find_one({"email": "client@cafirm.com"}):
        await database.users.insert_one({
            "email": "client@cafirm.com",
            "full_name": "Acme Corp",
            "role": "client",
            "hashed_password": get_password_hash("client123")
        })

    # Seed clients
    if await database.clients.count_documents({}) == 0:
        client_result = await database.clients.insert_one({
            "name": "Acme Corp",
            "email": "contact@acme.com",
            "pan": "ABCDE1234F",
            "phone": "9876543210",
            "assigned_staff_id": staff_id
        })
        client_id = str(client_result.inserted_id)

        # Seed some records
        from datetime import datetime, timedelta
        await database.records.insert_many([
            {
                "client_id": client_id,
                "client_name": "Acme Corp",
                "type": "itr",
                "status": "Completed",
                "amount": 5000.0,
                "due_date": datetime.utcnow() + timedelta(days=30),
                "notes": "Annual ITR filed."
            },
            {
                "client_id": client_id,
                "client_name": "Acme Corp",
                "type": "gst",
                "status": "In Progress",
                "amount": 2000.0,
                "due_date": datetime.utcnow() + timedelta(days=10),
                "notes": "Monthly GST return."
            }
        ])

async def close_mongo_connection():
    if db.client:
        db.client.close()

def get_database():
    return db.client[settings.DATABASE_NAME]
