from fastapi import APIRouter, Depends, Path, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...schemas.user import UserOut, UserUpdate
from ...models.user import User
from ...services.user_service import UserService
from ...auth.deps import get_current_active_user

router = APIRouter(
    prefix="/api/users",
    tags=["Kullanıcılar"],
    responses={404: {"description": "Bulunamadı"}}
)

@router.get("/me", response_model=UserOut)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Giriş yapmış kullanıcının bilgilerini döndürür
    """
    return UserOut.from_orm(current_user)

@router.put("/me", response_model=UserOut)
async def update_user_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Giriş yapmış kullanıcının bilgilerini günceller
    """
    return UserService.update_user(db, current_user.id, user_data)

@router.get("/", response_model=List[UserOut])
async def read_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Tüm kullanıcıları listeler (admin yetkisi gerektirebilir)
    """
    return UserService.get_users(db, skip, limit)

@router.get("/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Belirli bir kullanıcının bilgilerini getirir
    """
    return UserService.get_user(db, user_id)

@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_data: UserUpdate,
    user_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Belirli bir kullanıcının bilgilerini günceller (admin yetkisi gerektirebilir)
    """
    return UserService.update_user(db, user_id, user_data)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Belirli bir kullanıcıyı siler (admin yetkisi gerektirebilir)
    """
    return UserService.delete_user(db, user_id) 