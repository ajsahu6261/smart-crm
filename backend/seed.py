import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import get_settings
from core.security import get_password_hash

async def seed_db():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    admin_email = "admin@cafirm.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_user = {
            "email": admin_email,
            "full_name": "System Admin",
            "role": "admin",
            "hashed_password": get_password_hash("admin123")
        }
        await db.users.insert_one(admin_user)
        print(f"Admin user created: {admin_email} / admin123")
    else:
        print("Admin user already exists.")
        
    staff_email = "staff@cafirm.com"
    existing_staff = await db.users.find_one({"email": staff_email})
    if not existing_staff:
        staff_user = {
            "email": staff_email,
            "full_name": "Jane Staff",
            "role": "staff",
            "hashed_password": get_password_hash("staff123")
        }
        await db.users.insert_one(staff_user)
        print(f"Staff user created: {staff_email} / staff123")
        
    client_email = "client@cafirm.com"
    existing_client = await db.users.find_one({"email": client_email})
    if not existing_client:
        client_user = {
            "email": client_email,
            "full_name": "Acme Corp",
            "role": "client",
            "hashed_password": get_password_hash("client123")
        }
        await db.users.insert_one(client_user)
        print(f"Client user created: {client_email} / client123")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
