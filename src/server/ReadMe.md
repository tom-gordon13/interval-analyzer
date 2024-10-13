# Project Name README

## Description

Briefly describe your project here.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Docker installed on your system
- Correct Strava secret, redirect uri, etc


### Building the Docker Image

1. Open a terminal.
2. Navigate to the project directory that contains your Dockerfile.
3. Run the following command to build the Docker image:
   
   ```bash
   docker build -t my-app-image .

   ex. docker build -t api-server .

### Starting the Docker Container

docker run -d -p 3000:3000 --name {choice_name} api-server


### Stopping the Docker Container

docker stop api-server


### Removing the Docker Container

docker rm api-server