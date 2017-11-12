#include "common.h"
using namespace std;

// #define DAEMON_NAME     "Trablr Web Server"

static const char *s_http_port = "8080";
static struct mg_serve_http_opts s_http_server_opts;
static int s_sig_num = 0;

// static void set_syslog_levels(void)
// {
//     setlogmask(LOG_UPTO(LOG_INFO));
//     openlog(DAEMON_NAME, LOG_NDELAY | LOG_CONS, LOG_USER);
// }

static void create_daemon()
{
    pid_t pid;
    pid = fork();
    if (pid < 0)
        exit(EXIT_FAILURE);
    if (pid > 0)
        exit(EXIT_SUCCESS);
    if (setsid() < 0)
        exit(EXIT_FAILURE);
    umask(0);
    chdir("/");
    // syslog(LOG_INFO, "Deamon addded");
}

static void signal_handler(int sig_num) {
    signal(sig_num, signal_handler);
    s_sig_num = sig_num;
}

static int has_prefix(const struct mg_str *uri, const struct mg_str *prefix) {
    return uri->len > prefix->len && memcmp(uri->p, prefix->p, prefix->len) == 0;
}

static int is_equal(const struct mg_str *s1, const struct mg_str *s2) {
    return s1->len == s2->len && memcmp(s1->p, s2->p, s2->len) == 0;
}

static void ev_handler(struct mg_connection *nc, int ev, void *ev_data) {
    static const struct mg_str api_511_prefix = MG_MK_STR("/api/511");
    static const struct mg_str api_mysql_prefix = MG_MK_STR("/api/mysql");
    static const struct mg_str api_uber_prefix = MG_MK_STR("/api/uber");
    struct http_message *hm = (struct http_message *) ev_data;
    struct mg_str key;

    switch (ev) {
        case MG_EV_HTTP_REQUEST: {
            if (has_prefix(&hm->uri, &api_511_prefix)) {
                key.p = hm->uri.p + api_511_prefix.len;
                key.len = hm->uri.len - api_511_prefix.len;
                if (mg_vcmp(&key, "/get_stop_monitoring") == 0) {
                    printf("/get_stop_monitoring\n");
                    Trablr trablr;
                    trablr.get511ApiTransitStopMonitoring(nc, hm);
                } 
                else if (mg_vcmp(&hm->uri, "/show_time") == 0) {
                    printf("show_time\n");
                }
                else {
                    mg_printf(nc, "%s",
                    "HTTP/1.0 501 Not Implemented\r\n"
                    "Content-Length: 0\r\n\r\n");
                    printf("HTTP/1.0 501 Not Implemented\n");
                }
            }
            else if (has_prefix(&hm->uri, &api_mysql_prefix)) {
                key.p = hm->uri.p + api_mysql_prefix.len;
                key.len = hm->uri.len - api_mysql_prefix.len;
                if (mg_vcmp(&key, "/get_select_transit_id_start") == 0) {
                    printf("/get_select_transit_id_start\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.getSelectTransitIdStart(nc, hm);
                }
                else if (mg_vcmp(&key, "/get_select_transit_id_end") == 0) {
                    printf("/get_select_transit_id_end\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.getSelectTransitIdEnd(nc, hm);
                }
                else if (mg_vcmp(&key, "/check_favorite_route") == 0) {
                    printf("/check_favorite_route\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.checkFavoriteRoute(nc, hm);
                }
                else if (mg_vcmp(&key, "/insert_favorite_route") == 0) {
                    printf("/insert_favorite_route\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.insertFavoriteRoute(nc, hm);
                }
                else if (mg_vcmp(&key, "/update_favorite_route_usage") == 0) {
                    printf("/update_favorite_route_usage\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.updateFavoriteRouteUsage(nc, hm);
                }
                else if (mg_vcmp(&key, "/delete_favorite_route") == 0) {
                    printf("/delete_favorite_route\n");
                    TrablrMySql trablrmysql;
                    trablrmysql.deleteFavoriteRoute(nc, hm);
                }
                else {
                    mg_printf(nc, "%s",
                    "HTTP/1.0 501 Not Implemented\r\n"
                    "Content-Length: 0\r\n\r\n");
                    printf("HTTP/1.0 501 Not Implemented\n");
                }
            } else if (has_prefix(&hm->uri, &api_uber_prefix)) {
                key.p = hm->uri.p + api_uber_prefix.len;
                key.len = hm->uri.len - api_uber_prefix.len;
                if (mg_vcmp(&key, "/estimates/price") == 0) {
                    printf("/estimates/price\n");
                    Trablr trablr;
                    trablr.getUberEstimatesPrice(nc, hm);
                }
            } else {
                mg_serve_http(nc, hm, s_http_server_opts); /* Serve static content */
                printf("Serve static content\n");
            }
            break;
        }
        case MG_EV_TIMER: {
            double now = *(double *) ev_data;
            double next = mg_set_timer(nc, 0) + 1.0;
            printf("timer event, current time: %.2lf\n", now);
            mg_set_timer(nc, next);  // Send us timer event again after 0.5 seconds
            break;
        }
        default:
            break;
    }
}

int main(int argc, char *argv[]) {
    struct mg_mgr mgr;
    struct mg_connection *nc;
    int i;

    mg_mgr_init(&mgr, NULL);
    nc = mg_bind(&mgr, s_http_port, ev_handler);
    if (nc == NULL) {
        printf("Cannot start on port %s\n", s_http_port);
        return EXIT_FAILURE;
    }
    mg_set_protocol_http_websocket(nc);
    s_http_server_opts.document_root = "/var/www/html";

    for (i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-r") == 0) {
            s_http_server_opts.document_root = argv[++i];
        }
        else if (strcmp(argv[i], "-d") == 0) {
            create_daemon();
        }
    }

    signal(SIGINT, signal_handler);
    signal(SIGTERM, signal_handler);

    printf("Starting RESTful server on port %s\n", s_http_port);
    // syslog(LOG_INFO, "Starting RESTful server on port %s", s_http_port);
    while (s_sig_num == 0) {
        mg_mgr_poll(&mgr, 1000);
    }

    mg_mgr_free(&mgr);

    printf("Exiting on signal %d\n", s_sig_num);
    // syslog(LOG_INFO, "Exiting on signal %d", s_sig_num);

    closelog();

    return EXIT_SUCCESS;
}
