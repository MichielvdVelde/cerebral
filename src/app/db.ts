import { DBSchema, openDB } from "idb";

const DB_NAME = "cerebral";
const DB_VERSION = 1;

interface CerebralDB extends DBSchema {
  facets: {
    key: string;
    value: string;
  };
}

const open = () =>
  openDB<CerebralDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("facets", {
        keyPath: "key",
      });
    },
  });
