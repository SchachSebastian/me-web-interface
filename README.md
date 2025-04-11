# ME Web Interface

**Because vanilla Minecraft is too basic.**  
This is a fun side project that brings high-tech flair to my Minecraft world. I wanted a smoother way to interact with my Applied Energistics 2 ME storage system—so I built a custom web interface to view everything I’ve hoarded in style.

## 🚀 What It Does

This project connects a Minecraft ComputerCraft computer to a web-based React interface via a Node.js server, allowing you to:

- 📦 View all items stored in your **Applied Energistics 2 ME system**
- 🧠 Interface using a **Lua script with Advanced Peripherals’ ME Bridge**
- 🌐 Browse your inventory from a sleek **React frontend**

---

## 🛠️ Installation & Setup

### 🐳 Option 1: Use the Pre-built Docker Image from Docker Hub (Recommended)

If you’re using the **ATM 10 modpack**, you can skip the setup steps and use the pre-built Docker image available on Docker Hub. This is the fastest and easiest way to get up and running.

Run the following command:

```bash
docker run -e SECRET=yourSecretHere -p 80:80 schachsebastian/me-web-interface:atm10
```

- The server will run on **port 80**.
- The `SECRET` is **optional** and defaults to `"secret"`—which, let’s be honest, is basically like leaving your key under the doormat.  
  🔐 *For better security (and to avoid chaos), set a custom secret!*

> Worst-case scenario?  
> Some random prankster pushes fake inventory data and suddenly you’ve got 64 dirt blocks labeled as diamonds. 😱  
> Be smart—protect your ME system.

Once it’s up and running, open your browser and go to your server’s **public IP address** or **domain name** to access the ME system interface.

---

### 🖼️ Option 2: Build the Server from Scratch

If you prefer to build everything manually or you’re using a custom modpack, follow these steps.

#### 1. Install Python Dependencies

First, you need to install the required dependencies for the Python script. This can be done by installing the packages in the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

This will install the necessary dependencies, including **Tkinter** for the image extraction script.

#### 2. Extract Minecraft Item Icons

Before building the server, you’ll need to extract item icons from the modpack you're using.

Run:

```bash
python scripts/extractImages.py
```

- This script will **open a folder selection dialog using Tkinter**.
- Choose your **modpack directory** (e.g., the folder containing your `mods`, `config`, and `resourcepacks`).
- The script will locate and extract all relevant item textures for the frontend.

#### 3. Build & Run the Web Server with Docker

After extracting the images, build and run the Docker container:

```bash
docker build -t me-web-interface .
docker run -e SECRET=yourSecretHere -p 80:80 me-web-interface
```

- The server runs on **port 80**.
- The `SECRET` is **optional** and defaults to `"secret"`—which is basically like leaving your key under the doormat.  
  🔐 *For better security (and to avoid chaos), set a custom secret!*

> Worst-case scenario?  
> Some random prankster pushes fake inventory data and suddenly you’ve got 64 dirt blocks labeled as diamonds. 😱  
> Be smart—protect your ME system.

Once it’s up and running, open your browser and go to your server’s **public IP address** or **domain name** to access the ME system interface.

---

### 🖥️ 4. Install the Lua Script In-Game

On your ComputerCraft computer, run:

```lua
wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/install.lua
```

Then execute `install.lua` to install the full script.

#### Configure the Lua Script

Edit the file: `meWebInterface/config.lua`

```lua
local config = {
    url = "ws://<your-server-ip>", -- WebSocket URL of the Express server
    secret = "yourSecretHere",     -- Must match the Docker SECRET (or leave as "secret")
    maxItemsPerMessage = 100,
}

return config
```

---

## 📦 Tech Stack

- **Frontend:** React
- **Backend:** Node.js with Express
- **Communication:** WebSocket
- **Minecraft Mods:** Applied Energistics 2, ComputerCraft, Advanced Peripherals
