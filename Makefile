start_thetaboard:
	docker pull maurinl/thetaboard:latest
	docker run -d --name ${USERNAME}THETABOARD -p8000:8000 -e NODE_PASSWORD="${NODE_PASSWORD}" maurinl/thetaboard

restart_thetaboard:
	docker restart ${DOCKER_NAME}THETABOARD
