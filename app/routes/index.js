import user_routes from "./user_routes";
import session_routes from "./session_routes";

export default function routes (app, db) {
	session_routes(app, db);
}
