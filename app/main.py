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

@app.get("/teams_quiz/{division}")
def serve_teams_quiz(division: str):
    return FileResponse("static/teams.html")

@app.get("/api/teams/{division}")
def get_teams(division: str, session: SessionDep) -> list[Team]:
    teams = session.exec(select(Team).where(Team.division == division)).all()
    return teams