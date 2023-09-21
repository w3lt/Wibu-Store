FROM python

WORKDIR /data-analysis-server

COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .


CMD [ "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80", "--reload" ]