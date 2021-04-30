#!/bin/sh

# replace this with your SDK URL
export EDGE_SDK=default/82afd7ae-e7de-4567-817b-dd684315adf7/SHxmTA83AJupii4TsIciWvhaQYBIq2*JxIKxiUoswZPmLQAIIWN
# replace this if necessary with your edge url
export EDGE_HOST_URL=http://127.0.0.1:8903/
# one will fail depending on the value of the features, it mimics you setting the features up front
mvn -Dfeatures.imperative=true test
# this will pass because one after the other it will set the value of the features
#mvn -Dfeatures.imperative test
# when you have done that, change the pom.xml and uncomment the parallel test and run the imperative test again, one will
# fail because it cannot be both at the same time

