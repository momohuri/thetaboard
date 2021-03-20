# Dockerfile 
This docker come with :
 - Downloaded guardian node binary
 - ThetaBoard webserver

### Pre-requisite
Docker should have at least 4gb of runtime memory,<br>
Mac: https://docs.docker.com/docker-for-mac/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>
Windows: https://docs.docker.com/docker-for-windows/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>

### Dev to resources :

Build `docker build -t maurinl/thetaboard:latest -f docker/Dockerfile .`<br>
Push `docker push maurinl/thetaboard`<br>
Test using `docker run -d --name maurin_test -v /Users/maurinlenglart/IdeaProjects/thetaboard/webserver:/home/node/app/webserver_test2 -p8001:8000 -e NODE_PASSWORD=A-SECRET-PASSWRD maurinl/thetaboard `<br>



