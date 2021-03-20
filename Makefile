start_thetaboard:
	docker pull maurinl/thetaboard:latest
	docker run -d --name ${DOCKER_NAME}_THETABOARD -p8000:8000 maurinl/thetaboard -e NODE_PASSWORD=$NODE_PASSWORD

restart_thetaboard:
	docker restart ${DOCKER_NAME}_THETABOARD
