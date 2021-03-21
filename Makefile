start_thetaboard:
	docker pull maurinl/thetaboard:latest
	docker volume create ${USERNAME}THETABOARD
	docker run -d --name ${USERNAME}THETABOARD -p8000:8000 -e NODE_PASSWORD="${NODE_PASSWORD}" -v ${USERNAME}THETABOARD:/home/node/theta_mainnet maurinl/thetaboard

restart_thetaboard:
	docker restart ${DOCKER_NAME}THETABOARD

kill_thetaboard:
	docker rm -f ${DOCKER_NAME}THETABOARD


# DEV target only
run_dev_mode:
	docker run -d --name ${USERNAME}THETABOARD -e NODE_PASSWORD="${NODE_PASSWORD}" \
	 -v ${USERNAME}THETABOARD:/home/node/theta_mainnet \
	 -v $(shell pwd)/webserver:/home/node/app/webserver_test2 \
	 -p8000:8000 -p8001:8001 maurinl/thetaboard