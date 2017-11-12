#include "common.h"
using namespace std;

TrablrMySql::TrablrMySql(void) :
	DB_SERVER("tcp://127.0.0.1:3306"),
	DB_USERNAME("root"),
	DB_PASSWORD("spartan"),
	// DB_PASSWORD("password"),
	DB_SCHEMA("TRABLR_DB")
{ 
	printf("Creating Trablr Mysql\n");
	try {
		sql::Driver *driver;
		
		/* Create a connection */
		driver = get_driver_instance();
		con = driver->connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);
	
		/* Connect to the MySQL test database */
		stmt = con->createStatement();
		stmt->execute("USE " + DB_SCHEMA);

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}
}

TrablrMySql::~TrablrMySql(void) 
{ 
	printf("Destroying Trablr Mysql\n");
	delete con;
}

void TrablrMySql::getSelectTransitIdStart(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":\"0\"}";
	string statement = "", transit_id = "", stop_id = "";
	char line_id[11], direction[11];
    mg_get_http_var(&hm->body, "line_id", line_id, sizeof(line_id));
    mg_get_http_var(&hm->body, "direction", direction, sizeof(direction));

	try {
		statement = "SELECT TRANSIT_ID,STOP_ID,STOP_NAME FROM TRANSIT_INFO WHERE LINE_ID=";
		statement.append(line_id);
		statement += " AND DIRECTION='";
		statement.append(direction);
		statement += "' ORDER BY STOP_NAME ASC";
        res = stmt->executeQuery(statement);
        stringstream ss;
        int count = 0;
        json_result = "{\"SelectStopStartArray\":[";
		while (res->next()) {
			ss.str("");
			ss << res->getInt("TRANSIT_ID");
			transit_id = ss.str();
			ss.str("");
			ss << res->getInt("STOP_ID");
			stop_id = ss.str();
			if (count > 0)
				json_result += ",";
			json_result += "{\"TRANSIT_ID\":\"" + transit_id + "\",\"STOP_ID\":\"" + stop_id + "\",\"STOP_NAME\":\"" + res->getString("STOP_NAME") + "\"}";
			count++;
		}
		json_result += "]}";
		delete res;
		delete stmt;

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}

void TrablrMySql::getSelectTransitIdEnd(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":0}";
	string statement = "", transit_id = "", stop_id = "";
	char line_id[11], direction[11], transit_id_start[11];
    mg_get_http_var(&hm->body, "line_id", line_id, sizeof(line_id));
    mg_get_http_var(&hm->body, "direction", direction, sizeof(direction));
    mg_get_http_var(&hm->body, "transit_id_start", transit_id_start, sizeof(transit_id_start));

	try {
		statement = "SELECT TRANSIT_ID,STOP_ID,STOP_NAME FROM TRANSIT_INFO WHERE LINE_ID=";
		statement.append(line_id);
		statement += " AND DIRECTION='";
		statement.append(direction);
		statement += "' AND TRANSIT_ID<>";
		statement.append(transit_id_start);
		statement += " ORDER BY STOP_NAME ASC";
        res = stmt->executeQuery(statement);
        stringstream ss;
        int count = 0;
        json_result = "{\"SelectStopEndArray\":[";
		while (res->next()) {
			ss.str("");
			ss << res->getInt("TRANSIT_ID");
			transit_id = ss.str();
			ss.str("");
			ss << res->getInt("STOP_ID");
			stop_id = ss.str();
			if (count > 0)
				json_result += ",";
			json_result += "{\"TRANSIT_ID\":\"" + transit_id + "\",\"STOP_ID\":\"" + stop_id + "\",\"STOP_NAME\":\"" + res->getString("STOP_NAME") + "\"}";
			count++;
		}
		json_result += "]}";
		delete res;
		delete stmt;

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}

void TrablrMySql::checkFavoriteRoute(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":0}";
	string statement = "";
	int favorites_count = 0;
	char user_id[11], transit_id_start[11], transit_id_end[11];
    mg_get_http_var(&hm->body, "user_id", user_id, sizeof(user_id));
    mg_get_http_var(&hm->body, "transit_id_start", transit_id_start, sizeof(transit_id_start));
    mg_get_http_var(&hm->body, "transit_id_end", transit_id_end, sizeof(transit_id_end));

	try {
		statement = "SELECT COUNT(*) as favorites_count FROM USER_FAVORITES WHERE USER_ID=";
		statement.append(user_id);
		statement += " AND TRANSIT_ID_START=";
		statement.append(transit_id_start);
		statement += " AND TRANSIT_ID_END=";
		statement.append(transit_id_end);
		cout << statement << endl;
        res = stmt->executeQuery(statement);
		while (res->next()) {
			favorites_count = res->getInt("favorites_count");
		}
		delete res;
		delete stmt;

		if (favorites_count > 0)
			json_result = "{\"FavoriteRouteFlag\":\"true\"}";
		else
			json_result = "{\"FavoriteRouteFlag\":\"false\"}";

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}

void TrablrMySql::updateFavoriteRouteUsage(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":0}";
	string statement = "";
	char favorites_id[11];
    mg_get_http_var(&hm->body, "favorites_id", favorites_id, sizeof(favorites_id));

	try {
		statement = "UPDATE USER_FAVORITES SET CLICK_COUNT=CLICK_COUNT+1 WHERE FAVORITES_ID=";
		statement.append(favorites_id);
        stmt->execute(statement);
		delete stmt;

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}

void TrablrMySql::insertFavoriteRoute(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":0}";
	string statement = "";
	int favorites_count = 0;
	char user_id[11], transit_id_start[11], transit_id_end[11];
	mg_get_http_var(&hm->body, "user_id", user_id, sizeof(user_id));
    mg_get_http_var(&hm->body, "transit_id_start", transit_id_start, sizeof(transit_id_start));
    mg_get_http_var(&hm->body, "transit_id_end", transit_id_end, sizeof(transit_id_end));

	try {
		statement = "SELECT COUNT(*) as favorites_count FROM USER_FAVORITES WHERE USER_ID=";
		statement.append(user_id);
		res = stmt->executeQuery(statement);
		while (res->next()) {
			favorites_count = res->getInt("favorites_count");
		}
		delete res;

		statement.clear();
		if (favorites_count < 4) {
			statement = "INSERT INTO USER_FAVORITES (USER_ID,TRANSIT_ID_START,TRANSIT_ID_END,PRIORITY) VALUES (";
			statement.append(user_id);
			statement += ",";
			statement.append(transit_id_start);
			statement += ",";
			statement.append(transit_id_end);
			statement += ",";
			favorites_count += 1;
			stringstream ss;
        	ss << favorites_count;
			statement.append(ss.str());
			statement += ")";
	        cout << statement << endl;
			stmt->execute(statement);
			delete stmt;
		} else {
			json_result = "{\"Error\": \"Maximum favorite routes reached. Please delete a route before adding a new one\"}";
		}

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}

void TrablrMySql::deleteFavoriteRoute(struct mg_connection *nc, struct http_message *hm)
{
	string json_result = "{\"test\":0}";
	string statement = "";
	char favorites_id[11];
    mg_get_http_var(&hm->body, "favorites_id", favorites_id, sizeof(favorites_id));

	try {
		statement = "DELETE FROM USER_FAVORITES WHERE FAVORITES_ID=";
		statement.append(favorites_id);
        cout << statement << endl;
		stmt->execute(statement);
		delete stmt;

	} catch (sql::SQLException &e) {
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}

	cout << "Done." << endl;
    mg_printf(nc, "%s", "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n");
    mg_printf_http_chunk(nc, json_result.c_str());
    mg_send_http_chunk(nc, "", 0);
}
