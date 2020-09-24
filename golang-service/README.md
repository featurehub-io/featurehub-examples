Example GoLang Service
======================

This is a simple example of a Go HTTP service using the FeatureHub Go SDK.
- Establishes a connection to a FeatureHub server
- Configures a "logging" AnalyticsCollector (events are simply emitted as logs instead of actually being forwarded to something like Google Analytics)
- Handles HTTP requests
- Submits events for each request


Usage
-----

First you need a FeatureHub server:
- Run a FeatureHub server (`docker run --name featurehub -d -p 8085:80 -v ~/tmp/party:/db featurehub/party-server:0.0.7`)
- Configure it (http://localhost:8085)
- Add some features

Now run the example golang service:
- Put your SDK key into the consts in main.go
- `go run main.go`

Now hit the service with curl:
- `curl http://localhost:8080/hello?name=somebody`
-You should see an analytics event logged to the console

Now try some more features:
- Add a boolean feature-flag called "goodbye"
- Watch the logs - you'll see the service pick up the new feature
- Hit the service with CURL again - it will now respond differently!
