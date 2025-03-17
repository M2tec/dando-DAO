FROM alpine:latest

RUN apk add --no-cache  python3 \
                        py3-requests  \
                        nano 

COPY ./monitor.py ./


RUN mkdir /logs/monitor

RUN touch crontab.tmp \
    && echo '0 9 * * * /monitor.py' > crontab.tmp \
    && crontab crontab.tmp \
    && rm -rf crontab.tmp

CMD ["/usr/sbin/crond", "-f", "-d", "0"]