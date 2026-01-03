from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Dict

from database import engine, get_db, Base
from schemas import (
    UserCreate, User, Token, NovelCreate, Novel,
    ChapterCreate, Chapter, UserNovelStatus
)
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from crud import (
    get_novels, get_novel, create_novel, update_novel, delete_novel,
    create_chapter, get_chapters,
    set_user_novel_status
)
from models import User as UserModel

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Novera API", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Аутентификация ===
@app.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_email = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = UserModel(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


# === Новеллы ===
@app.get("/novels/", response_model=List[Novel])
def read_novels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_novels(db, skip=skip, limit=limit)


@app.get("/novels/{novel_id}", response_model=Novel)
def read_novel(novel_id: int, db: Session = Depends(get_db)):
    novel = get_novel(db, novel_id)
    if novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return novel


@app.post("/novels/", response_model=Novel)
def create_novel_endpoint(
    novel: NovelCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    return create_novel(db=db, novel=novel, owner_id=current_user.id)


@app.put("/novels/{novel_id}", response_model=Novel)
def update_novel_endpoint(
    novel_id: int,
    novel: NovelCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    db_novel = get_novel(db, novel_id)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    if db_novel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return update_novel(db, novel_id=novel_id, novel=novel)


@app.delete("/novels/{novel_id}", response_model=Novel)
def delete_novel_endpoint(
    novel_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    db_novel = get_novel(db, novel_id)
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    if db_novel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return delete_novel(db, novel_id=novel_id)


# === Главы ===
@app.get("/novels/{novel_id}/chapters/", response_model=List[Chapter])
def read_chapters(novel_id: int, db: Session = Depends(get_db)):
    return get_chapters(db, novel_id)


@app.post("/novels/{novel_id}/chapters/", response_model=Chapter)
def create_chapter_endpoint(
    novel_id: int,
    chapter: ChapterCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    novel = get_novel(db, novel_id)
    if novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    if novel.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return create_chapter(db=db, chapter=chapter, novel_id=novel_id)


# === Закладки / Статусы ===
@app.post("/novels/{novel_id}/status/")
def set_novel_status(
    novel_id: int,
    status_data: Dict[str, str],
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    status = status_data.get("status")
    valid_statuses = ["reading", "will_read", "completed", "dropped", "liked"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    return set_user_novel_status(db, current_user.id, novel_id, status)


@app.get("/user/novels/status/")
def get_user_novels_status(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)):
    from models import UserNovelStatus
    statuses = db.query(UserNovelStatus).filter(UserNovelStatus.user_id == current_user.id).all()
    return [{"novel_id": s.novel_id, "status": s.status} for s in statuses]