#!/bin/bash

# Set pwd to /home/user
cd /home/ec2-user

# Update packages
sudo yum update -y

# Install git, unzip and say yes to any questions
sudo yum install git unzip -y

# Clone repo
git clone https://github.com/rakazirut/RobBot.git

# Install AWS cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/installls
rm awscliv2.zip

# Install NVM and Node version we want
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash   
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install 16.17.0

# Change pwd to RobBot
cd RobBot

# Copy auth.json from s3 to ec2
aws s3 cp s3://rkrobbot/auth.json .

# Install dependancies and run bot
npm i
node bot.js
