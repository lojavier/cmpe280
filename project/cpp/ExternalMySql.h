#ifndef EXTERNALMYSQL_H
#define EXTERNALMYSQL_H

#include "common.h"
using namespace std;

class TrablrMySql {
    public:
        TrablrMySql();
        ~TrablrMySql();
        void getSelectTransitIdStart(struct mg_connection *nc, struct http_message *hm);
        void getSelectTransitIdEnd(struct mg_connection *nc, struct http_message *hm);
        void checkFavoriteRoute(struct mg_connection *nc, struct http_message *hm);
        void insertFavoriteRoute(struct mg_connection *nc, struct http_message *hm);
        void updateFavoriteRouteUsage(struct mg_connection *nc, struct http_message *hm);
        void deleteFavoriteRoute(struct mg_connection *nc, struct http_message *hm);

    private:
        const string DB_SERVER;
        const string DB_USERNAME;
        const string DB_PASSWORD;
        const string DB_SCHEMA;

        sql::Connection *con;
        sql::Statement *stmt;
        sql::ResultSet *res;
        // sql::PreparedStatement *pstmt;
};

#endif
