#!/bin/bash

##########################################################################
# this script would spin up environment from the ground
##########################################################################
helpFunction()
{
   echo ""
   echo "Usage: $0 -s secret"
   echo -e "\t-s Please pass scerent token"
   exit 1 # Exit script after printing help
}

while getopts "s:" opt
do
   case "$opt" in
      s ) secret="$OPTARG";;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$secret" ] 
then
   echo "the parameters is empty";
   helpFunction
fi

git pull origin master
mkdir -p ~/mongodb-data
echo $secret > env.dev
docker-compose --env-file ./env.dev up -d