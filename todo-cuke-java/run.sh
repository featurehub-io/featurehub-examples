#!/bin/sh

# replace this with your SDK URL
export EDGE_SDK=default/ed31c8f1-830d-45af-b4a1-9a90d0ccdcd9/Dl8MbSMKG0whTUmujWFF5ggASztVljK1isy47TPpvbpfbY9SN99fdspHNZEBzq1P5Bn8yV2dVCyxaFVL
# replace this if necessary with your edge url
export EDGE_HOST_URL=http://localhost:8553
# one will fail depending on the value of the features, it mimics you setting the features up front
mvn test
# this will pass because one after the other it will set the value of the features
#mvn -Dfeatures.imperative test
# when you have done that, change the pom.xml and uncomment the parallel test and run the imperative test again, one will
# fail because it cannot be both at the same time

