from models import Team, engine, create_db_and_tables
from sqlmodel import Session, delete
import pandas as pd

df = pd.read_excel('data/ultiquiz_seed.xlsx', sheet_name='Teams')

teams = []

for row_tuple in df.itertuples():
    alias_list = row_tuple.aliases.split(',')

    teams.append({"school": row_tuple.school, "teamname": row_tuple.teamname, "aliases": alias_list, 
                  "division": row_tuple.division, "finish": row_tuple.finish, "rank": row_tuple.rank})

create_db_and_tables()

with Session(engine) as session:
    session.exec(delete(Team))
    session.commit()

    for t in teams:
        session.add(Team(**t))
    session.commit()
