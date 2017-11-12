#include "common.h"
using namespace rapidjson;

string API_RESPONSE_JSON;

Trablr::Trablr(void) :
    host_name("http://api.511.org"),
    api_key("876be52b-5ed7-46bf-bfe9-43443887b34a"),
    // api_key("df8fb6d5-d994-4579-9537-84018bcb12e4"),
    format("JSON")
{ printf("Creating Trablr\n"); }

Trablr::~Trablr(void) { printf("Destroying Trablr\n"); }

static size_t writeCallback(char* buff, size_t size, size_t nmemb) {
    for (size_t c = 0; c < size*nmemb; c++) {
        if (static_cast<int>(buff[c]) >= 0)
            API_RESPONSE_JSON.push_back(buff[c]);
    }
    return size*nmemb;
}

void Trablr::performCurl(string ApiUrl) {
    CURL *curl;
    CURLcode res;

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, ApiUrl.c_str());
        curl_easy_setopt(curl, CURLOPT_ACCEPT_ENCODING, "");
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, &writeCallback);
        // curl_easy_setopt(curl, CURLOPT_WRITEDATA, &API_RESPONSE_JSON);

        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
}

void Trablr::get511ApiTransitOperators(struct mg_connection *nc) {
    string api_prefix = "/transit/operators";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }

    assert(document.IsArray());
    for (SizeType i = 0; i < document.Size(); i++) {
        assert(document[SizeType(i)].IsObject());
        const Value& temp = document[SizeType(i)];
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        temp.Accept(writer);
        cout << buffer.GetString() << endl;
    }

    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"result\": %d }", 99);
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitLines(struct mg_connection *nc) {
    string api_prefix = "/transit/lines";
    string operator_id = "VTA";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&operator_id=" + operator_id
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }
    assert(document.IsArray());
    for (SizeType i = 0; i < document.Size(); i++) {
        assert(document[SizeType(i)].IsObject());
        const Value& temp = document[SizeType(i)];
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        temp.Accept(writer);
        cout << buffer.GetString() << endl;
    }

    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"result\": %d }", 99);
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitStops(struct mg_connection *nc) {
    string api_prefix = "/transit/stops";
    string operator_id = "VTA";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&operator_id=" + operator_id
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }
    assert(document.IsObject());
    assert(document.HasMember("Contents"));
    assert(document["Contents"].HasMember("dataObjects"));
    assert(document["Contents"]["dataObjects"].HasMember("ScheduledStopPoint"));
    const Value& stops = document["Contents"]["dataObjects"]["ScheduledStopPoint"];
    assert(stops.IsArray());
    for (SizeType i = 0; i < stops.Size(); i++) {
        assert(stops[SizeType(i)].IsObject());
        const Value& temp = stops[SizeType(i)];
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        temp.Accept(writer);
        cout << buffer.GetString() << endl;
    }

    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"result\": %d }", 99);
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitStopPlaces(struct mg_connection *nc) {
    string api_prefix = "/transit/stopPlaces";
    string operator_id = "VTA";
    string stop_id = "60824";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&operator_id=" + operator_id
                            + "&stop_id=" + stop_id
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }
    assert(document.IsObject());
    assert(document.HasMember("Siri"));
    assert(document["Siri"].HasMember("ServiceDelivery"));
    assert(document["Siri"]["ServiceDelivery"].HasMember("DataObjectDelivery"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"].HasMember("dataObjects"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"].HasMember("SiteFrame"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"].HasMember("stopPlaces"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"].HasMember("StopPlace"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"].HasMember("Centroid"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"]["Centroid"].HasMember("Location"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"]["Centroid"]["Location"].HasMember("Longitude"));
    assert(document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"]["Centroid"]["Location"].HasMember("Latitude"));
    const Value& longitude = document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"]["Centroid"]["Location"]["Longitude"];
    const Value& latitude = document["Siri"]["ServiceDelivery"]["DataObjectDelivery"]["dataObjects"]["SiteFrame"]["stopPlaces"]["StopPlace"]["Centroid"]["Location"]["Latitude"];
    assert(longitude.IsString());
    assert(latitude.IsString());
    cout << "Longitude : " << longitude.GetString() << endl;
    cout << "Latitude : " << latitude.GetString() << endl;

    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"result\": %d }", 99);
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitStopMonitoring(struct mg_connection *nc, struct http_message *hm) {
    char line_id[10], stopCode[10], stop_id_end[10];
    mg_get_http_var(&hm->body, "line_id", line_id, sizeof(line_id));
    mg_get_http_var(&hm->body, "stop_id_start", stopCode, sizeof(stopCode));
    mg_get_http_var(&hm->body, "stop_id_end", stop_id_end, sizeof(stop_id_end));
    string api_prefix = "/transit/StopMonitoring";
    string agency = "VTA";
    // strncpy(line_id, "60", sizeof(line_id));
    // strncpy(stopCode, "60824", sizeof(stopCode));
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&agency=" + agency
                            + "&stopCode=" + stopCode
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
        cout << API_RESPONSE_JSON << '\n';
        exit(EXIT_FAILURE);
    }
    assert(document.IsObject());
    assert(document.HasMember("ServiceDelivery"));
    assert(document["ServiceDelivery"].HasMember("StopMonitoringDelivery"));
    assert(document["ServiceDelivery"]["StopMonitoringDelivery"].HasMember("MonitoredStopVisit"));
    const Value& stopVisit = document["ServiceDelivery"]["StopMonitoringDelivery"]["MonitoredStopVisit"];
    assert(stopVisit.IsArray());
    vector<string> AimedArrivalTimeVector;
    if (stopVisit.Size() > 0) {
        string prev, next;
        for (SizeType i = 0; i < stopVisit.Size(); i++) {
            assert(stopVisit[SizeType(i)].IsObject());
            assert(stopVisit[SizeType(i)].HasMember("MonitoredVehicleJourney"));
            assert(stopVisit[SizeType(i)]["MonitoredVehicleJourney"].HasMember("LineRef"));
            if (strcmp(line_id, stopVisit[SizeType(i)]["MonitoredVehicleJourney"]["LineRef"].GetString()) == 0) {
                assert(stopVisit[SizeType(i)]["MonitoredVehicleJourney"]["MonitoredCall"].HasMember("AimedArrivalTime"));
                next = stopVisit[SizeType(i)]["MonitoredVehicleJourney"]["MonitoredCall"]["AimedArrivalTime"].GetString();
                if (prev.compare(next) != 0) {
                    prev = next;
                    AimedArrivalTimeVector.push_back(next);
                }
            }
        }
    } else {
        printf("Error: ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit[] is empty\n");
    }

    string json_result = "{\"AimedArrivalTime\":[";
    for (uint i = 0; i < AimedArrivalTimeVector.size(); i++) {
        if (i > 0) {
            json_result += ",";
        }
        cout << AimedArrivalTimeVector[i] << '\n';

        // char buf[80];
        struct tm tm_arrival_utc;
        strptime(AimedArrivalTimeVector[i].c_str(), "%FT%TZ", &tm_arrival_utc);
        time_t time_arrival_utc = timegm(&tm_arrival_utc);
        // cout << "time_arrival_utc = " << time_arrival_utc << '\n';
        // strftime(buf, sizeof(buf), "%I:%M %p", &tm_arrival_utc);
        // cout << "time_arrival_utc = " << buf << '\n';

        char ArrivalTime[20];
        struct tm *tm_local = localtime(&time_arrival_utc);
        time_t time_local = mktime(tm_local);
        strftime(ArrivalTime, sizeof(ArrivalTime), "%I:%M %p", tm_local);
        cout << "ArrivalTime = " << ArrivalTime << '\n';

        // struct tm *tm_current;
        // time_t time_current = time(NULL);
        // tm_current = localtime(&time_current);
        // strftime(buf, sizeof(buf), "%I:%M %p", tm_current);
        // cout << "time_current = " << buf << '\n';

        uint ArrivalMinutes = floor(difftime(time_local, time(NULL)) / 60);
        cout << "ArrivalMinutes = " << ArrivalMinutes << '\n';

        stringstream ss;
        ss << ArrivalTime;
        json_result += "{\"ArrivalTime\":\"" + ss.str() + "\"";
        ss.str("");
        ss << ArrivalMinutes;
        json_result += ",\"ArrivalMinutes\":" + ss.str() + "}";

        // json_result += "\"" + AimedArrivalTimeVector[i] + "\"";        
    }
    json_result += "]}";
    cout << json_result << '\n';

    printf("line_id=%s  stop_id_start=%s  stop_id_end=%s\n", line_id, stopCode, stop_id_end);
    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    // mg_printf_http_chunk(nc, "{ \"line_id_result\": %d, \"stop_id_start_result\": %d, \"stop_id_end_result\": %d }", atoi(line_id), atoi(stopCode), atoi(stop_id_end));
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitVehicleMonitoring(struct mg_connection *nc, struct http_message *hm) {
    char line_id[10], vehicleID[10], stop_id_end[10];
    mg_get_http_var(&hm->body, "line_id", line_id, sizeof(line_id));
    mg_get_http_var(&hm->body, "stop_id_start", vehicleID, sizeof(vehicleID));
    mg_get_http_var(&hm->body, "stop_id_end", stop_id_end, sizeof(stop_id_end));
    string api_prefix = "/transit/VehicleMonitoring";
    string agency = "VTA";
    // string vehicleID = "60824";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&agency=" + agency
                            + "&vehicleID=" + vehicleID
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;

    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }
    assert(document.IsObject());
    assert(document.HasMember("Siri"));
    assert(document["Siri"].HasMember("ServiceDelivery"));
    assert(document["Siri"]["ServiceDelivery"].HasMember("VehicleMonitoringDelivery"));
    assert(document["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"].HasMember("VehicleActivity"));
    const Value& vehicleActivity = document["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"];
    assert(vehicleActivity.IsArray());
    for (SizeType i = 0; i < vehicleActivity.Size(); i++) {
        assert(vehicleActivity[SizeType(i)].IsObject());
        const Value& temp = vehicleActivity[SizeType(i)];
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        temp.Accept(writer);
        cout << buffer.GetString() << endl;
    }

    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"result\": %d }", 99);
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::get511ApiTransitTimetable(struct mg_connection *nc, struct http_message *hm) {
    char line_id[10], stop_id_start[10], stop_id_end[10];
    mg_get_http_var(&hm->body, "line_id", line_id, sizeof(line_id));
    mg_get_http_var(&hm->body, "stop_id_start", stop_id_start, sizeof(stop_id_start));
    mg_get_http_var(&hm->body, "stop_id_end", stop_id_end, sizeof(stop_id_end));
    string api_prefix = "/transit/timetable";
    string operator_id = "VTA";
    // string line_id = "60";
    string API_REQUEST_URL = host_name + api_prefix
                            + "?api_key=" + api_key
                            + "&operator_id=" + operator_id
                            + "&line_id=" + line_id
                            + "&format=" + format;
    cout << API_REQUEST_URL << endl;
    
    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    Document document;
    if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
        fprintf(stderr, "JSON Parsing error\n");
    }
    assert(document.IsObject());
    assert(document.HasMember("Content"));
    assert(document["Content"].HasMember("TimetableFrame"));
    const Value& timetableFrame = document["Content"]["TimetableFrame"];
    assert(timetableFrame.IsArray());
    for (SizeType i = 0; i < timetableFrame.Size(); i++) {
        assert(timetableFrame[SizeType(i)].IsObject());
        const Value& temp = timetableFrame[SizeType(i)];
        StringBuffer buffer;
        Writer<StringBuffer> writer(buffer);
        temp.Accept(writer);
        // cout << buffer.GetString() << endl;
    }

    printf("line_id=%s stop_id_start=%s stop_id_end=%s\n", line_id, stop_id_start, stop_id_end);
    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"line_id_result\": %d, \"stop_id_start_result\": %d, \"stop_id_end_result\": %d }", atoi(line_id), atoi(stop_id_start), atoi(stop_id_end));
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::getUberEstimatesPrice(struct mg_connection *nc, struct http_message *hm) {
    char Authorization[100], Content_Type[100], Accept_Language[100];
    mg_get_http_var(&hm->body, "Authorization", Authorization, sizeof(Authorization));
    mg_get_http_var(&hm->body, "Content_Type", Content_Type, sizeof(Content_Type));
    mg_get_http_var(&hm->body, "Accept_Language", Accept_Language, sizeof(Accept_Language));

    string API_REQUEST_URL = "https://api.uber.com/v1.2/estimates/price?start_latitude=37.7752315&start_longitude=-122.418075&end_latitude=37.7752415&end_longitude=-122.518075&server_token=RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn";
    cout << API_REQUEST_URL << endl;
    
    API_RESPONSE_JSON.clear();
    performCurl(API_REQUEST_URL);

    // string api_prefix = "/transit/timetable";
    // string operator_id = "VTA";
    // // string Authorization = "60";
    // string API_REQUEST_URL = host_name + api_prefix
    //                         + "?api_key=" + api_key
    //                         + "&operator_id=" + operator_id
    //                         + "&Authorization=" + Authorization
    //                         + "&format=" + format;
    // cout << API_REQUEST_URL << endl;
    
    // API_RESPONSE_JSON.clear();
    // performCurl(API_REQUEST_URL);

    // Document document;
    // if (document.Parse<0>(API_RESPONSE_JSON.c_str()).HasParseError()) {
    //     fprintf(stderr, "JSON Parsing error\n");
    // }
    // assert(document.IsObject());
    // assert(document.HasMember("Content"));
    // assert(document["Content"].HasMember("TimetableFrame"));
    // const Value& timetableFrame = document["Content"]["TimetableFrame"];
    // assert(timetableFrame.IsArray());
    // for (SizeType i = 0; i < timetableFrame.Size(); i++) {
    //     assert(timetableFrame[SizeType(i)].IsObject());
    //     const Value& temp = timetableFrame[SizeType(i)];
    //     StringBuffer buffer;
    //     Writer<StringBuffer> writer(buffer);
    //     temp.Accept(writer);
    //     // cout << buffer.GetString() << endl;
    // }

    printf("Authorization=%s Content_Type=%s Accept_Language=%s\n", Authorization, Content_Type, Accept_Language);
    printf("RESULTS=%s\n", API_RESPONSE_JSON.c_str());
    /* Compute the result and send it back as a JSON object */
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"Authorization_result\": %d, \"Content_Type_result\": %d, \"Accept_Language_result\": %d }", atoi(Authorization), atoi(Content_Type), atoi(Accept_Language));
    mg_send_http_chunk(nc, "", 0);
}

void Trablr::loopTest(struct mg_connection *nc) {
    uint x = mg_time();
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, "{ \"line_id_result\": %d, \"stop_id_start_result\": %d, \"stop_id_end_result\": %d }", x, x, x);
    mg_send_http_chunk(nc, "", 0);
}

// void Trablr::handle_sum_call(struct mg_connection *nc, struct http_message *hm) {
//     char n1[100], n2[100];
//     double result;

//     /* Get form variables */
//     mg_get_http_var(&hm->body, "n1", n1, sizeof(n1));
//     mg_get_http_var(&hm->body, "n2", n2, sizeof(n2));

//     printf("n1=%s n2=%s\n", n1, n2);

//     /* Send headers */
//     mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");

//     /* Compute the result and send it back as a JSON object */
//     result = strtod(n1, NULL) + strtod(n2, NULL);
//     mg_printf_http_chunk(nc, "{ \"result\": %lf }", result);
//     mg_send_http_chunk(nc, "", 0); /* Send empty chunk, the end of response */
// }
