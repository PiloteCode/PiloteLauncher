/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0
 */

const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const os = require("os");
const pkg = require("../../../../package.json");
const DiscordRPC = require('discord-rpc');

let dev = process.env.DEV_TOOL === 'open';
let mainWindow = undefined;

function getWindow() {
    return mainWindow;
}

function destroyWindow() {
    if (!mainWindow) return;
    app.quit();
    mainWindow = undefined;
}



function createWindow() {
    destroyWindow();
    mainWindow = new BrowserWindow({
        title: pkg.preductname,
        width: 1280,
        height: 720,
        minWidth: 980,
        minHeight: 552,
        resizable: true,
        icon: `./src/assets/images/icon.${os.platform() === "win32" ? "ico" : "png"}`,
        frame: os.platform() !== 'win32',
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });

    Menu.setApplicationMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(path.join(`${app.getAppPath()}/src/launcher.html`));
    mainWindow.once('ready-to-show', () => {
        if (mainWindow) {
            if (dev) mainWindow.webContents.openDevTools({ mode: 'detach' });
            mainWindow.show();
            initializeDiscordRPC();
        }
    });
}

const version = pkg.version;

function initializeDiscordRPC() {
    const clientId = '1258778967649947718';
    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    const startTimestamp = new Date();

    rpc.on('ready', () => {
        console.log('Discord RPC prêt');
        rpc.setActivity({
            details: `Pilote SMP`,
            state: `1 joueur - 1.20.4 Forge`,
            startTimestamp,
            largeImageKey: 'image',
            largeImageText: `Pilote SMP`,
            smallImageKey: 'image_small',
            smallImageText: version,
            buttons: [
                { label: 'Rejoindre', url: 'https://discord.gg/PILOTE' }
            ],
            instance: false,
        });
    });

    rpc.login({ clientId }).catch(error => {
        console.error('Erreur lors de la connexion Discord RPC', error);
    });
}

module.exports = {
    getWindow,
    createWindow,
    destroyWindow,
};
