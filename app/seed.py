from models import Team, engine, create_db_and_tables
from sqlmodel import Session, delete

teams = [
    {"school": "Carleton College", "teamname": "CUT", "aliases": ["Carleton", "CUT"],"division": "d1m", "finish": "1", "rank": 1},
    {"school": "Colorado", "teamname": "Mamabird", "aliases": ["Colorado", "Mamabird"], "division": "d1m", "finish": "2", "rank": 2},
    {"school": "Oregon", "teamname": "Ego", "aliases": ["Oregon", "Ego"], "division": "d1m", "finish": "3T", "rank": 3},
    {"school": "Massachusetts", "teamname": "ZooDisc", "aliases": ["UMass", "ZooDisc"], "division": "d1m", "finish": "3T", "rank": 4},
    {"school": "North Carolina", "teamname": "Darkside", "aliases": ["UNC", "Darkside"], "division": "d1m", "finish": "5T", "rank": 5},
]

create_db_and_tables()

with Session(engine) as session:
    session.exec(delete(Team))
    session.commit()

    for t in teams:
        session.add(Team(**t))
    session.commit()
