ifeq ($(GUARDIANNAME), )
port = 8000:8000
else
port = 8000
endif
start_thetaboard:
	docker pull maurinl/thetaboard:latest
	docker volume create ${GUARDIANNAME}THETABOARD
	docker run -d --name ${GUARDIANNAME}THETABOARD -p$(port) -e NODE_PASSWORD="${NODE_PASSWORD}" -v ${USERNAME}THETABOARD:/home/node/theta_mainnet maurinl/thetaboard
	docker port ${GUARDIANNAME}THETABOARD 8000


restart_thetaboard:
	docker restart ${GUARDIANNAME}THETABOARD

kill_thetaboard:
	docker rm -f ${GUARDIANNAME}THETABOARD


# DEV target only
run_dev_mode:
	docker run -d --name ${GUARDIANNAME}THETABOARD -e NODE_PASSWORD="${NODE_PASSWORD}" \
	 -v ${USERNAME}THETABOARD:/home/node/theta_mainnet \
	 -v $(shell pwd)/webserver:/home/node/app/webserver_test2 \
	 -p8000:8000 -p8001:8001 maurinl/thetaboard