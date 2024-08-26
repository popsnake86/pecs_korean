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
      text TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      isDefault TEXT
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
    INSERT OR IGNORE INTO card(id, type, text, imageUrl, isDefault) VALUES
      ("아빠_default", "S", "아빠", "", "X"),
      ("엄마_default", "S", "엄마", "", "X"),
      ("물_default", "O", "물", "", "X"),
      ("젤리_default", "O", "젤리", "", "X"),
      ("체리_default", "O", "체리", "", "X"),
      ("심슨과자_default", "O", "심슨과자", "", "X"),
      ("오징어땅콩_default", "O", "오징어땅콩", "", "X"),
      ("바나나_default", "O", "바나나", "", "X"),
      ("화장실_default", "O", "화장실", "", "X"),
      ("주세요_default", "V", "주세요", "", "X"),
      ("갈래요_default", "V", "갈래요", "", "X");
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

export async function getAllCard(type) {
  return await database.getAllAsync("SELECT * FROM card WHERE type = ?", type);
}

export async function getCardByText(text) {
  return await database.getAllAsync("SELECT * FROM card WHERE text = ?", text);
}

export async function insertCard(type, text, imageUrl) {
  return await database.runAsync(
    "INSERT INTO card(id, type, text, imageUrl, isDefault) VALUES (?, ?, ?, ?, ?)",
    text,
    type,
    text,
    imageUrl,
    ""
  );
}

export async function deleteCard(id) {
  return await database.runAsync("DELETE FROM card WHERE id = ?", id);
}
