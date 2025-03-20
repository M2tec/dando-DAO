FROM alpine:latest

RUN apk update
RUN apk add --no-cache  openrc \
                        dcron \
                        python3 \
                        py3-requests  \
                        nano 

COPY ./monitor.py ./


RUN mkdir -p /logs/monitor

# RUN mkdir -p /var/log/cron && \
#     mkdir /scripts && \
#     mkdir -m 0644 -p /var/spool/cron/crontabs && \
#     touch /var/log/cron/cron.log && \
#     mkdir -m 0644 -p /etc/cron.d
# RUN mkdir /var/spool/anacron


# RUN touch crontab.tmp \
#     && echo '0 9 * * * /monitor.py' > crontab.tmp \
#     && crontab crontab.tmp \
#     && rm -rf crontab.tmp

RUN touch /etc/cron.d/dno_monitor \
    && echo '0 9 * * * /monitor.py' > /etc/cron.d/dno_monitor 
# RUN rc-service dcron start
# CMD ["rc-service", "dcron", "start"]
# CMD ["/usr/sbin/crond", "-f", "-d", "0"]

### Debugging only
ENTRYPOINT ["tail"]
CMD ["-f","/dev/null"]