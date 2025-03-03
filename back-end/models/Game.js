import Datastore from "nedb";
const db = new Datastore({ filename: "games.db", autoload: true });

export default db;
