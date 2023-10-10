from pydantic import BaseModel
from typing import Optional

class Body(BaseModel):
    uid: int = None
    start_index: Optional[int] = None
    number: int

    def __init__(self, **data):
        super().__init__(**data)
        if self.start_index is None:
            self.start_index = 0