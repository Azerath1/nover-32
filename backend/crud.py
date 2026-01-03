from sqlalchemy.orm import Session
from models import Novel, Chapter, UserNovelStatus
from schemas import NovelCreate, ChapterCreate

# --- NOVEL ---
def get_novels(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Novel).offset(skip).limit(limit).all()

def get_novel(db: Session, novel_id: int):
    return db.query(Novel).filter(Novel.id == novel_id).first()

def create_novel(db: Session, novel: NovelCreate, owner_id: int):
    db_novel = Novel(**novel.dict(), owner_id=owner_id)
    db.add(db_novel)
    db.commit()
    db.refresh(db_novel)
    return db_novel

def update_novel(db: Session, novel_id: int, novel: NovelCreate):
    db_novel = get_novel(db, novel_id)
    if db_novel:
        for key, value in novel.dict().items():
            setattr(db_novel, key, value)
        db.commit()
        db.refresh(db_novel)
    return db_novel

def delete_novel(db: Session, novel_id: int):
    db_novel = get_novel(db, novel_id)
    if db_novel:
        db.delete(db_novel)
        db.commit()
    return db_novel

# --- CHAPTER ---
def create_chapter(db: Session, chapter: ChapterCreate, novel_id: int):
    db_chapter = Chapter(**chapter.dict(), novel_id=novel_id)
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter

def get_chapters(db: Session, novel_id: int):
    return db.query(Chapter).filter(Chapter.novel_id == novel_id).order_by(Chapter.chapter_number).all()

# --- USER NOVEL STATUS (Закладки) ---
def get_user_novel_status(db: Session, user_id: int, novel_id: int):
    return db.query(UserNovelStatus).filter(
        UserNovelStatus.user_id == user_id,
        UserNovelStatus.novel_id == novel_id
    ).first()

def set_user_novel_status(db: Session, user_id: int, novel_id: int, status: str):
    status_obj = get_user_novel_status(db, user_id, novel_id)
    if status_obj:
        status_obj.status = status
    else:
        status_obj = UserNovelStatus(user_id=user_id, novel_id=novel_id, status=status)
        db.add(status_obj)
    db.commit()
    db.refresh(status_obj)
    return status_obj