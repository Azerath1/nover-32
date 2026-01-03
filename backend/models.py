from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    novels = relationship("Novel", back_populates="owner")
    statuses = relationship("UserNovelStatus", back_populates="user")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    chapter_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    novel_id = Column(Integer, ForeignKey("novels.id"))
    novel = relationship("Novel", back_populates="chapters")

class Novel(Base):
    __tablename__ = "novels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    author = Column(String)
    genre = Column(String)
    status = Column(String, default="Ongoing")
    rating = Column(Float, default=0.0)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="novels")

    chapters = relationship("Chapter", back_populates="novel", cascade="all, delete-orphan")
    statuses = relationship("UserNovelStatus", back_populates="novel")

class UserNovelStatus(Base):
    __tablename__ = "user_novel_status"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="will_read")  # reading, will_read, completed, dropped, liked
    user_id = Column(Integer, ForeignKey("users.id"))
    novel_id = Column(Integer, ForeignKey("novels.id"))

    user = relationship("User", back_populates="statuses")
    novel = relationship("Novel", back_populates="statuses")

    __table_args__ = (UniqueConstraint('user_id', 'novel_id', name='unique_user_novel'),)