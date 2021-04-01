# Thetaboard
You are trying to set up your own guardian node for Theta ? You want an easy-to-use web interface to manage it ?
You want a 360° view of you wallet, transactions, holdings, staking 

You came to the right place ! Thetaboard was made to easily set up a theta guardian node on your laptop or on the cloud.
It can also be used to get information about Theta and your wallet.<br>
<br> 

#### Live demo : https://ns100226.ip-147-135-1.us/guardian 

#### Join us on Discord: https://discord.gg/SGUtY7zBU3


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
 - *COMING SOON*: Stake your tfuel on your edge node using this interface as well ( we are waiting on mainnet 3.0 + some API's from theta's team)
 
We don't and will never track any data about anything at all.


## Get Started
### Prerequisite
Theta wallet extension on chrome
 - https://chrome.google.com/webstore/detail/theta-wallet/ckelpdlfgochnkdgikcgbimdcfgpkhgk/related?hl=en&authuser=0

Docker with at least 4gb and Make available (installation is only needed on Windows)

### Starting the Thetaboard + Guardian Node
**Step1**: Get the make file , then run the start command <br>

```shell
curl -L https://raw.githubusercontent.com/momohuri/thetaboard/main/Makefile -o ./Makefile
NODE_PASSWORD='A-SECRET-PASSWRD' make start_thetaboard
```
**Step2**: Done!  you can now visit : http://localhost:8080

### Options 
If you want to run multiples Guardian Node on the same machine you can set individual names using the following variable: <br>
`NODE_PASSWORD='A-SECRET-PASSWRD' GUARDIANNAME='REPLACE_THIS' make start_docker ` <br>
You can restart your docker using: <br>
`GUARDIANNAME='REPLACE_THIS' make restart_thetaboard`

## Tutorial

How to install pre-req on Windows:
- Step 1 install Docker:  https://docs.docker.com/docker-for-windows/install/
- Step 2 give Docker 4gb of Ram: https://docs.docker.com/docker-for-windows/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed.
- Step 3 install Make: https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows
<br>
  
How to install pre-req on Mac:
- Step 1 install Docker: https://docs.docker.com/docker-for-mac/install/
- Step 2 give Docker 4gb of Ram: https://docs.docker.com/docker-for-mac/#:~:text=Memory%3A%20By%20default%2C%20Docker%20Desktop,swap%20file%20size%20as%20needed. <br>
<br>

How to install pre-req on Linux:
- Step 1 install Docker: https://docs.docker.com/engine/install/ubuntu/ <br>



## FAQ


#### Do we host Guardian Nodes ?
We encourage you to set up your own Guardian Node by using the tutorials on this page. <br>
But also offer Gurdian Node hosting if you want to. This is free while we are in beta. Please contact us on discord for more info: https://discord.gg/SGUtY7zBU3 


#### What is different between Thetaboard and Gpool?


In our architecture, everyone has their own Guardian Node. <br>
Which is better for a couple of reason:  We are not a "man in the middle" between you and your GN. 
So you get rewards right away, and you get full control over your Guardian Node. <br>
It is also better for theta network health in general as more GN the better. <br>
Last point, on top of the Guardian Node we also provide a cool dashboard that allow you to track price, 
get chart about your wallet, history of your transactions, forecasting of Tfuel rewards, and a lot of other valuable information for any theta holder.

