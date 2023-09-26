#!/bin/bash

python3 scheduleTask.py &
uvicorn app:app --host 0.0.0.0 --port 80 --reload 