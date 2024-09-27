import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseSync("database.db");

export async function dbInit() {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS grammarMode (
      id INTEGER PRIMARY KEY NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS setting (
      id INTEGER PRIMARY KEY NOT NULL,
      settingName TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS card (
      id TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      isFolder TEXT,
      parent TEXT,
      text TEXT NOT NULL,
      imageUrl TEXT NOT NULL
    );
  `);
}

export async function dbInit2() {
  await database.execAsync(`
    INSERT OR IGNORE INTO grammarMode(code, description) VALUES
      ("1", "목적어"),
      ("2", "목적어+서술어"),
      ("3", "주어+목적어+서술어");
    INSERT OR IGNORE INTO setting(settingName, code) VALUES
      ("grammarMode", "3"),
      ("readTwiceMode", "Y");
  `);
}

export async function getAllGrammarMode() {
  return await database.getAllAsync("SELECT * FROM grammarMode");
}

export async function getSelectedGrammarMode() {
  return await database.getFirstAsync(
    "SELECT code FROM setting WHERE settingName = ?",
    "grammarMode"
  );
}

export async function updateGrammarSetting(code) {
  await database.runAsync(
    "UPDATE setting SET code = ? WHERE settingName = ?",
    code,
    "grammarMode"
  );
}

export async function getSelectedReadTwiceMode() {
  return await database.getFirstAsync(
    "SELECT code FROM setting WHERE settingName = ?",
    "readTwiceMode"
  );
}

export async function updateReadTwiceSetting(code) {
  await database.runAsync(
    "UPDATE setting SET code = ? WHERE settingName = ?",
    code,
    "readTwiceMode"
  );
}

export async function getAllFolder(type, parent) {
  return await database.getAllAsync(
    "SELECT * FROM card WHERE type = ? AND isFolder = ? AND parent = ?",
    type,
    "X",
    parent
  );
}

export async function getAllCard(type, parent) {
  return await database.getAllAsync(
    "SELECT * FROM card WHERE type = ? AND isFolder = ? AND parent = ?",
    type,
    "",
    parent
  );
}

export async function getCardByText(text) {
  return await database.getAllAsync("SELECT * FROM card WHERE text = ?", text);
}

export async function insertCard(type, isFolder, parent, text, imageUrl) {
  return await database.runAsync(
    "INSERT INTO card(id, type, isFolder, parent, text, imageUrl) VALUES (?, ?, ?, ?, ?, ?)",
    text,
    type,
    isFolder,
    parent,
    text,
    imageUrl
  );
}

export async function deleteCard(id) {
  return await database.runAsync("DELETE FROM card WHERE id = ?", id);
}
