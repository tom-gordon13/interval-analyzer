# Project Name README

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Docker installed on your system


### Building the Docker Image

1. Open a terminal.
2. Navigate to the project directory that contains your Dockerfile.
3. Run the following command to build the Docker image:
   
   ```bash
   docker build -t my-app-image .

   ex. docker build -t web-app .

### Starting the Docker Container

docker run -d -p 3001:3001 --name {choice_name} web-app


### Stopping the Docker Container

docker stop web-app


### Removing the Docker Container

docker rm web-app