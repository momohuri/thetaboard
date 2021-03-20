# Thetaboard
An easy-to-use Docker container for installing &amp; running a Theta guardian node.
It is provided with a webserver with the following features:
 - Linked to your theta wallet
 - Show your theta/t-fuels and beautiful graphs to tracks your favorite metrics
 - Enables you to stake your theta to your Guardian Node
 - Allows you to start/stop your Guardian Node
 - See the status and logs of your Guardian Node
 
We don't and will never track any data about anything at all.


## Get Started
###Prerequisite
Docker installed 
- Mac: https://docs.docker.com/docker-for-mac/install/ 
- Windows: https://docs.docker.com/docker-for-windows/install/
- Linux: https://docs.docker.com/engine/install/ubuntu/ <br>

Docker should have at least 4gb of runtime memory
- Mac: https://docs.docker.com/docker-for-mac/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>
- Windows: https://docs.docker.com/docker-for-windows/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>

(Windows Only) Make installed
 - https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows

### Starting the Thetaboard + Guardian Node
get the make file , then run the start command
```shell
curl https://github.com/momohuri/thetaboard/blob/main/Makefile --output ./Makefile
NODE_PASSWORD=A-SECRET-PASSWRD make start_thetaboard
```
Done, you can now visit : http://localhost:8080

### Options 
If you want to run multiples dockers on your machine you can set individual names using the following variable: <br>
`NODE_PASSWORD=A-SECRET-PASSWRD DOCKER_NAME='REPLACE_THIS' make start_docker ` <br>
You can restart your docker using:
` make restart_thetaboard `