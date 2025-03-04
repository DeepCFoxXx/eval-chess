# MongoDB Local Setup on macOS

This guide provides step-by-step instructions to install, configure, and start MongoDB locally on macOS.

---

## 1. Install MongoDB via Homebrew

```sh
brew tap mongodb/brew
brew install mongodb-community@7.0
```

---

## 2. Verify Installation

```sh
brew list | grep mongodb
```

Ensure that `mongodb-community@7.0` appears in the list.

---

## 3. Start MongoDB Service

```sh
brew services start mongodb-community@7.0
```

Check the service status:

```sh
brew services list
```

If there's an error, you can manually start the server:

```sh
mongod --dbpath /usr/local/var/mongodb
```

---

## 4. Increase Open File Limits (if necessary)

If you see warnings about soft rlimits for open file descriptors being too low, run:

```sh
ulimit -n 64000
```

To make this change permanent, add it to your shell profile (`~/.zshrc` or `~/.bashrc`):

```sh
echo "ulimit -n 64000" >> ~/.zshrc
source ~/.zshrc
```

---

## 5. Connect to MongoDB

Open a new terminal window and run:

```sh
mongosh
```

You should see a connection message confirming MongoDB is running.

---

## 6. Verify MongoDB is Running

Inside `mongosh`, check the server status:

```sh
db.runCommand({ serverStatus: 1 })
```

If MongoDB is running correctly, it will return detailed server information.

---

## 7. Stop MongoDB

To stop the MongoDB service:

```sh
brew services stop mongodb-community@7.0
```

Or if running manually:

```sh
pkill mongod
```

---

### Troubleshooting

- If `mongod` fails to start due to permission errors, try:

  ```sh
  sudo chown -R $(whoami) /usr/local/var/mongodb
  ```

- If `mongosh` is not found, install it:

  ```sh
  brew install mongosh
  ```

---
