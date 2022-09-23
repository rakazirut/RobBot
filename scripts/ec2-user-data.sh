#!/bin/bash

# Set pwd to /home/user
cd /home/ec2-user

# Update packages
sudo yum update -y

# Install git, unzip and say yes to any questions
sudo yum install git unzip docker -y

# Clone repo
git clone https://github.com/rakazirut/RobBot.git

# Install AWS cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/installls
rm awscliv2.zip

#Add group membership for the default ec2-user so you can run all docker commands without using the sudo command
sudo usermod -a -G docker ec2-user
id ec2-user
newgrp docker

# Change pwd to RobBot
cd RobBot

# Copy auth.json from s3 to ec2
aws s3 cp s3://rkrobbot/auth.json .

# Enable docker service at AMI boot time
sudo systemctl enable docker.service

# Start the Docker service
sudo systemctl start docker.service

# Build RobBot docker image
docker build -t robbot .

# Start RobBot docker container
docker run -d --restart on-failure robbot
