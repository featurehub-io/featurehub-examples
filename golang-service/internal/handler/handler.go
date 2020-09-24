package handler

import (
	"fmt"
	"net/http"

	"github.com/featurehub-io/featurehub/sdks/client-go/pkg/interfaces"
	"github.com/sirupsen/logrus"
)

// Handler provides basic mocks of the Turn webhook API:
type Handler struct {
	logger   *logrus.Logger
	fhClient interfaces.Client
}

// New returns a new Handler:
func New(logger *logrus.Logger, fhClient interfaces.Client) *Handler {
	return &Handler{
		logger:   logger,
		fhClient: fhClient,
	}
}

// Hello returns a greeting:
func (h *Handler) Hello(w http.ResponseWriter, r *http.Request) {

	// Get the "name" parameter (from the query string):
	name := r.FormValue("name")

	// Log an analytics event:
	tags := map[string]string{"name": name}
	h.fhClient.LogAnalyticsEvent("Hello", tags)

	// Look up a boolean feature called "goodbye":
	goodbye, err := h.fhClient.GetBoolean("goodbye")
	if err != nil {
		h.logger.WithError(err).Warn("Error retrieving feature")
	}

	// Respond:
	if goodbye {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(fmt.Sprintf("Goodbye, %s", name)))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(fmt.Sprintf("Hello, %s", name)))
	}
}
