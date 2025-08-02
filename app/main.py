from typing import Annotated
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Query
from sqlmodel import select

from models import SessionDep, Team

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def homepage():
    return FileResponse("static/index.html")

@app.get("/d1m")
def serve_d1mens():
    return FileResponse("static/d1m.html")

@app.get("/api/d1m")
def get_d1m(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Team]:
    teams = session.exec(select(Team).offset(offset).limit(limit)).all()
    return teams