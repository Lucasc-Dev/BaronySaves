import fs from 'fs';
import path from 'path';

import config from './config/config.js';

const BARONY_BACKUPS_DIRECTORY = config.backups_directory_path;
const BARONY_SAVEFILES_PATH = config.savefiles_path;
const BARONY_SAVEGAME_FILE = config.savegame_file;

const saveFilePath = path.join(BARONY_SAVEFILES_PATH, BARONY_SAVEGAME_FILE);
const backupsFolderPath = path.join(BARONY_BACKUPS_DIRECTORY);

let restoreState = false;

createBackupsFolderIfNotExists();

fs.watchFile(saveFilePath, { interval: 2000 }, () => {
    if (restoreState) {
        restoreState = false;

        return;
    }

    handleFileChange();
});

function handleFileChange() {
    const checkSaveFileExists = fs.existsSync(saveFilePath);

    if(checkSaveFileExists){
        createSaveBackup();
    }else {
        restoreSave();
    }
}

function createSaveBackup() {
    const timestamp = Date.now().toString();
    const timestampBackupFolderPath = path.join(backupsFolderPath, timestamp);
    const backupFilePath = path.join(timestampBackupFolderPath, BARONY_SAVEGAME_FILE);
    
    fs.mkdirSync(timestampBackupFolderPath);

    fs.copyFileSync(saveFilePath, backupFilePath);
    
    const currentDate = new Date();
    console.log(`[${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}] Save Backup feito com sucesso`);

    return;
}

function restoreSave() {
    const backupsFolderList = fs.readdirSync(backupsFolderPath);

    if(backupsFolderList.length === 0){
        console.log('Nenhum backup encontrado para restaurar.');

        return;
    }

    restoreState = true;

    try {
        const lastModifiedFolder = backupsFolderList[backupsFolderList.length - 1];
        const backupFilePath = path.join(backupsFolderPath, lastModifiedFolder, BARONY_SAVEGAME_FILE);
        
        fs.copyFileSync(backupFilePath, saveFilePath);

        const currentDate = new Date();

        console.log(`[${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}] Save Restore feito com sucesso`);
    }catch (err) {
        console.log(err);

        restoreState = false;
    }
}

function createBackupsFolderIfNotExists() {
    if (!fs.existsSync(backupsFolderPath)) {
        fs.mkdirSync(backupsFolderPath);
    }
}
