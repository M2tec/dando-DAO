FROM ubuntu:24.04

COPY ./monitor.py ./

RUN apt update
RUN apt install python3 python3-requests cron nano -y

RUN mkdir -p /logs/monitor

RUN touch /etc/cron.d/dno_monitor \
    && echo 'VITE_GRAPH_URL="https://dgraph.m2tec.nl/graphql"' > /etc/cron.d/dno_monitor \
    && echo 'LOG_FOLDER="/logs/monitor/"' >> /etc/cron.d/dno_monitor \
    && echo '0 9 * * * root /monitor.py > /tmp/monitor.log' >> /etc/cron.d/dno_monitor 

RUN chmod 0644 /etc/cron.d/dno_monitor && crontab /etc/cron.d/dno_monitor

RUN touch /var/log/cron.log

CMD ["cron", "-f"]

# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]


