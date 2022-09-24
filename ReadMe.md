# RobBot

Custom Discord Bot

Built using node.js

## Docker Commands

 - docker build -t robbot .
    - Build image

- docker run -d --restart on-failure robbot
    - Run image

- docker container stop <container name>
    - Stop image

- docker container prune
    - Delete image

- docker ps
    - List Containers

- docker exec -it <container_id> /bin/bash
    - Access running Container

- docker logs <container_id>
    - Get the log

## EC2 Image details
- AMI
    - ID: ami-026b57f3c383c2eec
    - Description: Amazon Linux 2 Kernel 5.10 AMI 2.0.20220912.1 x86_64 HVM gp2
- Instance Type
    - t2.micro
- Allow SSH Traffic
- Storage
    - 1x 8 GiB gp2 volume
- IAM Instance Profile
    - Profile with admin s3 access
        - For access secret
- User Data
    - use script: ec2-user-data.sh

## AWS EC2 Launch from template
aws ec2 run-instances --launch-template LaunchTemplateId=lt-0dd5918511adde591

aws ec2 describe-instances

aws ec2 terminate-instances --instance-ids <instance-ids>

## Commands
1. name: 'Cats, bro.', value: 'ex: !cat'

2. name: 'Look up what words mean.', value: 'ex: !urban Dance'

3. name: 'WWKS?', value: 'ex: !kanye'

4. name: 'BlackPeopleTwitter', value: 'ex: !bpt' ,

5. name: 'Memes', value: 'ex: !meme' ,

6. name: 'Get drunk?', value: 'ex: !drink' ,

7. name: 'Youtube', value: 'ex: !yt bustin' ,

8. name: 'reminder', value: 'note: the number is seconds until you should be reminded. ex: !remind 30 your-message-stubbed' ,

9. name: 'Diablo 3 Command Info', value: 'ex: !d3' 