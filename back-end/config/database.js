import Datastore from "nedb-promises";
import path from "path";

const db = Datastore.create({
  filename: path.join(process.cwd(), "data", "games.db"),
  autoload: true,
});

export default db;
