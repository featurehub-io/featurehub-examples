package main

import (
	"net/http"

	"github.com/featurehub-io/featurehub-examples/golang-service/internal/handler"
	"github.com/featurehub-io/featurehub/sdks/client-go"
	"github.com/featurehub-io/featurehub/sdks/client-go/pkg/analytics"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

const (
	listenAddress = ":8080"
	sdkKey        = "default/2a059b65-e9ca-4889-9622-525af14301c7/xQTU7Ah1fjtSE3f5vK7fwLgNA6uBph4q56TPkYk9AUbWlX7usYc9d44FJI2HDByGoRWkV3ak5JknOVv8"
	serverAddress = "http://localhost:8085"
)

func main() {

	// Set up a TRACE level logger:
	logger := logrus.New()
	logger.SetLevel(logrus.TraceLevel)

	// Prepare a config for the FeatureHub client:
	config := &client.Config{
		SDKKey:        sdkKey,
		ServerAddress: serverAddress,
		WaitForData:   true,
		LogLevel:      logrus.DebugLevel,
	}

	// Attempt to make a new client:
	fhClient, err := client.NewStreamingClient(config)
	if err != nil {
		logrus.Fatalf("Error connecting to FeatureHub: %s", err)
	}

	// Configure a logging analytics collector:
	fhClient.AddAnalyticsCollector(analytics.NewLoggingAnalyticsCollector(logger))

	// Start receiving data from FeatureHub:
	fhClient.Start()

	// Prepare a turn.io handler using the recorder:
	handler := handler.New(logger, fhClient)

	// Prepare a MUX router:
	router := mux.NewRouter()
	router.HandleFunc("/hello", handler.Hello).Methods(http.MethodGet)
	http.Handle("/", router)

	// Serve:
	logrus.WithField("listen_address", listenAddress).Info("Started serving")
	logrus.WithError(http.ListenAndServe(listenAddress, router)).Fatal("Stopped serving")
}
