import datetime
import jwt
from django.conf import settings

JWT_SECRET = settings.SECRET_KEY
JWT_ALG = "HS256"

def create_access_token(user):
  payload = {
      "sub": user.id,
      "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
  }
  return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def create_refresh_token(user):
  payload = {
      "sub": user.id,
      "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
      "type": "refresh",
  }
  return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token):
  try:
      return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
  except jwt.PyJWTError:
      return None
