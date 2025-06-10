FROM alpine:latest

RUN apk update
RUN apk add --no-cache  supercronic \
                        python3 \
                        py3-requests

COPY ./monitor.py ./
COPY ./balance.py ./

RUN mkdir -p /logs/monitor

RUN echo '0 6 * * * /monitor.py > /tmp/monitor.log' >> /crontab 
RUN echo '0 5 * * * /balance.py > /tmp/balance.log' >> /crontab 

CMD [ "/usr/bin/supercronic", "/crontab" ]

### Debugging only
# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]
