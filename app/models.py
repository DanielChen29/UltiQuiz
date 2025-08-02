from sqlmodel import JSON, Column, Field, SQLModel, Session, create_engine
from typing import Annotated
from fastapi import Depends

sqlite_file_name = "data/database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

class Team(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    school: str
    teamname: str
    aliases: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    division: str
    finish: str
    rank: int
