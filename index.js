//MAIN PROCESS FILE
import { createCanvas } from "canvas";
import {
    app,
    BrowserWindow,
    ipcMain,
    nativeImage,
    Tray,
    Menu,
} from "electron"
import fs from 'fs';
import path from 'path';

// for setting up tray icon
let tray;
//appData/roaming/weather-app

let latitude;
let longitude;

//filepath for weather data
const filePath = path.join(app.getPath('userData'), 'weather.json');

//create icon
const str_to_image = (weather) => {
    const canvas_ = createCanvas(16, 16);
    const ctx = canvas_.getContext('2d');

    // Draw and fill the circle first
    ctx.fillStyle = 'green'; // Add color
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas_.width, canvas_.height);
    ctx.fill(); // Actually fill it with color

    ctx.fillStyle = "white"; // color of font
    ctx.font = "10px sans-serif"; // font
    ctx.textBaseline = "middle" // the center point
    ctx.textAlign = "center"; // align
    ctx.fillText(`${weather}°`, canvas_.width / 2, canvas_.height / 2); //add now the text

    const dataURL = canvas_.toBuffer('image/png');
    const image_ = nativeImage.createFromBuffer(dataURL);

    return image_;
};

//create window
const createWindow = () => {
    //create a window
    const win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            preload: path.join(app.getAppPath(), "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    win.loadFile('public/index.html');//html file
    // win.removeMenu();//remove the menu bar
};

//delete after 1 day
const cleanOldFile = () => {
    if (fs.existsSync(filePath) && Date.now() - fs.statSync(filePath).mtimeMs > 1 * 24 * 60 * 60 * 1000) {//1 day then remove from the appData/roaming folder
        fs.unlinkSync(filePath);
    };
};

app.whenReady().then(() => {

    cleanOldFile();// delete the saved weather.json
    createWindow();// init the window

    //initial temp from starting
    tray = new Tray(str_to_image(0));

    //when tray icon is click it will be opened
    tray.on('click', () => {
        const wins = BrowserWindow.getAllWindows();
        if (wins.length === 0) {
            createWindow();
        } else {
            const win = wins[0];
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    //show current temp on system tray
    ipcMain.handle('temp', (event, arg) => {

        //current temp, if it did not return a value skip the next step
        if(arg == ""){
            return ""
        }

        tray.setImage(str_to_image(arg.slice(0, 2)));
        tray.setToolTip(arg);

        tray.setImage(str_to_image(arg.slice(0, 2)));
        tray.setToolTip(arg);
    });

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open App',
            click: () => {
                const wins = BrowserWindow.getAllWindows()
                if (wins.length === 0) {
                    createWindow()
                } else {
                    wins[0].focus()
                }
            }
        },
        { role: 'quit' }
    ]);

    tray.setContextMenu(contextMenu);

});

// so the tray menu will work
app.on('window-all-closed', () => {
    // having this listener active will prevent the app from quitting.
});

// send the location string to renderer
ipcMain.handle('locate', async (event, arg) => {
    latitude = arg.latitude;
    longitude = arg.longitude;
});

// call api here it is more secure
ipcMain.handle('get-api', async () => {

    // const latitude = 9.7392;
    // const longitude = 118.7353;

    // do not do anything if input is empty
    if(latitude === "" || longitude === "") return "";

    // rewrite again if lat and lon are called
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        
        const lat_ = Math.round(JSON.parse(data).latitude * 4)/4
        const lon_ = Math.round(JSON.parse(data).longitude * 4)/4

        if(Math.round(latitude * 4)/4 === lat_ && Math.round(longitude * 4)/4 === lon_){
            console.log("🌤 using cached weather data ...");
            return { status: "🌤 cached weather data ", data: JSON.parse(data) };
        };
    };

    console.log("🌤 Fetching new weather...");
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&timezone=auto`
    );
    const data = await response.json();

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { status: "✅ Saved weather to JSON file", data: data };
});

// handles the weather codes 
ipcMain.handle('get-weather-codes', async () => {
    const filename = path.join(app.getAppPath(), "weather_codes.json");
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
});