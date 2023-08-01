from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.main import app as backend_app

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=['*'], allow_methods=['*'],
    allow_headers=['*'],
)


app.mount("/api", backend_app)
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")


