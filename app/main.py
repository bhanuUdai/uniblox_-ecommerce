from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Ecommerce")

app.include_router(router)

if __name__ == "__main__":
     app.run(app, host="0.0.0.0", port=8000)