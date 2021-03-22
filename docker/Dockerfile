FROM node:14-buster

# guardian node prereq
RUN apt update
RUN apt install -y screen && apt install -y vim
WORKDIR /home/node/
RUN mkdir -p /home/node/theta_mainnet
WORKDIR /home/node/theta_mainnet
RUN mkdir -p bin
RUN mkdir -p guardian_mainnet/node
RUN curl -k --output bin/theta `curl -k 'https://mainnet-data.thetatoken.org/binary?os=linux&name=theta'`
RUN curl -k --output bin/thetacli `curl -k 'https://mainnet-data.thetatoken.org/binary?os=linux&name=thetacli'`
RUN mkdir -p node
RUN curl -k --output /home/node/theta_mainnet/guardian_mainnet/node/config.yaml `curl -k 'https://mainnet-data.thetatoken.org/config?is_guardian=true'`
RUN wget -O /home/node/theta_mainnet/guardian_mainnet/node/snapshot `curl -k https://mainnet-data.thetatoken.org/snapshot`
RUN chmod +x bin/theta
RUN chmod +x bin/thetacli
RUN chown -R node:node /home/node/theta_mainnet
EXPOSE 16888 30001

# Webserver /nodejs
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
COPY webserver ./
RUN chown -R node:node /home/node/app
USER node
RUN rm -rf ./node_modules/*
RUN npm install
COPY --chown=node:node . .
EXPOSE 8000
CMD [ "nohup", "node", "index.js" ]

