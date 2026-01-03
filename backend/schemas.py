from pydantic import BaseModel
from typing import List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class NovelBase(BaseModel):
    title: str
    description: str | None = None
    author: str | None = None
    genre: str | None = None
    status: str = "Ongoing"
    rating: float = 0.0

class NovelCreate(NovelBase):
    pass

class ChapterBase(BaseModel):
    title: str
    content: str
    chapter_number: int

class ChapterCreate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    created_at: datetime
    novel_id: int

    class Config:
        from_attributes = True

class UserNovelStatusBase(BaseModel):
    status: str

class UserNovelStatusCreate(UserNovelStatusBase):
    pass

class UserNovelStatus(UserNovelStatusBase):
    id: int
    user_id: int
    novel_id: int

    class Config:
        from_attributes = True

class Novel(NovelBase):
    id: int
    owner_id: int
    chapters: List[Chapter] = []

    class Config:
        from_attributes = True