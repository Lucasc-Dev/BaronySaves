import fs from 'fs';
import path from 'path';

import config from './config/config.js';

const BARONY_BACKUPS_DIRECTORY = config.backups_directory_path;
const BARONY_SAVEFILES_PATH = config.savefiles_path;
const BARONY_SAVEGAME_FILE = config.savegame_file;

const saveFilePath = path.join(BARONY_SAVEFILES_PATH, BARONY_SAVEGAME_FILE);

fs.watchFile(saveFilePath, { interval: 2000 }, () => {
    createBackupFile();
});

function createBackupFile() {
    const backupsFolderPath = path.join(BARONY_BACKUPS_DIRECTORY, 'Barony Backups');

    if (!fs.existsSync(backupsFolderPath)) {
        fs.mkdirSync(backupsFolderPath);
    }

    const timestamp = Date.now().toString();
    const backupFolderPath = path.join(backupsFolderPath, timestamp);
    
    fs.mkdirSync(path.join(backupFolderPath))

    const backupFilePath = path.join(backupFolderPath, BARONY_SAVEGAME_FILE)

    fs.copyFileSync(saveFilePath, backupFilePath);

    const currentDate = new Date();

    console.log(`[${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}] Backup feito com sucesso`);
}