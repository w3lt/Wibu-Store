FROM python

WORKDIR /data-analysis-server

COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
RUN chmod +x ./run.sh


CMD [ "./run.sh" ]