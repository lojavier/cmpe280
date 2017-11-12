#ifndef EXTERNALAPI_H
#define EXTERNALAPI_H

#include "common.h"
using namespace std;

class Trablr {
    public:
        Trablr();
        ~Trablr();
        void performCurl(string ApiUrl);
        void get511ApiTransitOperators(struct mg_connection *nc);
        void get511ApiTransitLines(struct mg_connection *nc);
        void get511ApiTransitStops(struct mg_connection *nc);
        void get511ApiTransitStopPlaces(struct mg_connection *nc);
        void get511ApiTransitStopMonitoring(struct mg_connection *nc, struct http_message *hm);
        void get511ApiTransitVehicleMonitoring(struct mg_connection *nc, struct http_message *hm);
        void get511ApiTransitTimetable(struct mg_connection *nc, struct http_message *hm);
        void getUberEstimatesPrice(struct mg_connection *nc, struct http_message *hm);
        void loopTest(struct mg_connection *nc);
        // void handle_sum_call(struct mg_connection *nc, struct http_message *hm);

    private:
        const string host_name;
        const string api_key;
        const string format;
};

#endif
