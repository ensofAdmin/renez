# users/face_engine.py
import insightface
import numpy as np

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=0, det_size=(640, 640))

def get_embedding(image_bgr):
  faces = model.get(image_bgr)
  if not faces:
      return None
  return faces[0].embedding.tolist()
