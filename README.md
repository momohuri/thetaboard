# Thetaboard
Your are trying to setup your own guardian node for Theta ? You want an easy to use web interface to manage it ? 
You came to the right place ! Thetaboard was made to easily setup a theta guardian node on your laptop or production ready deploy it up on a server on the cloud of your choice. <br>
You want to run multiple instance of a guardian node on the same machine to share the cost with your theta holders friends? This project can do that as well ! <br>
<br> 

### Features
An easy-to-use Docker container for installing &amp; running a Theta guardian node.
It is provided with a webserver with the following features:
 - Linked to your theta wallet
 - Show your theta and t-fuels holdings
 - Beautiful graphs to tracks your favorite metrics
 - Stake your theta to your Guardian Node in one click
 - Start/Stop your Guardian Node
 - Update your Guardian Node to the latest version
 - See the Status and logs of your Guardian Node
 
We don't and will never track any data about anything at all.


## Get Started
### Prerequisite
Theta wallet extension on chrome
 - https://chrome.google.com/webstore/detail/theta-wallet/ckelpdlfgochnkdgikcgbimdcfgpkhgk/related?hl=en&authuser=0

Docker with at least 4gb and Make available (installation is only needed on Windows)

### Starting the Thetaboard + Guardian Node
get the make file , then run the start command
```shell
curl https://github.com/momohuri/thetaboard/blob/main/Makefile --output ./Makefile
NODE_PASSWORD='A-SECRET-PASSWRD' make start_thetaboard
```
Done, you can now visit : http://localhost:8080

### Options 
If you want to run multiples dockers on your machine you can set individual names using the following variable: <br>
`NODE_PASSWORD=A-SECRET-PASSWRD USERNAME='REPLACE_THIS' make start_docker ` <br>
You can restart your docker using: <br>
` make restart_thetaboard `

## Tutorial

How to install pre-req on Windows:
 -Step 1 install Docker:  https://docs.docker.com/docker-for-windows/install/
- Step 2 give Docker 4gb of Ram: https://docs.docker.com/docker-for-windows/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed.
- Step 3 install Make: https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows
<br>
  
How to install pre-req on Mac:
- Step 1 install Docker: https://docs.docker.com/docker-for-mac/install/
- Step 2 give Docker 4gb of Ram: https://docs.docker.com/docker-for-mac/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>
<br>

How to install pre-req on Mac:
- Step 1 install Docker: https://docs.docker.com/engine/install/ubuntu/ <br>



