dBeacon-backend
===============

### **0. Introduction**

This is the backend and web UI for dBeaconExperience, you can visualize and manipulate the data using the web UI.

For backend, I'm using `Node` + `Express` + `Neo4j`.

For frontend, I'm using `Angular` + `Bootstrap` + `Jade` + `D3`

If everything works well, it should look like this in the browser:

![Screen Shot](Screenshot.png)

### **1. Installation**

**Install Node.js:**

Follow the instruction at:

https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

After installation, type in:
```
node -v
```
It should return:
```
v0.10.x
```
Which means you have successfully installed `Node.js`.

*If anything went wrong, don't worry, there's a good article you can refer to:*

https://github.com/joyent/node/wiki/installing-node.js-via-package-manager

**Install Neo4j:**

Again, follow the instruction at:

http://docs.neo4j.org/chunked/stable/server-installation.html

Note that you need to have `JDK 7+` on your computer in order to run `Neo4j`. You can also install `Neo4j` using package manager. After installation, start the `Neo4j` service and you should be able to using the `Neo4j` build-in web UI:

http://localhost:7474/browser/

**Install & Update ruby**

Before populate the data into database, you need to update `Ruby` to at least 2.1.2.

If you're running Linux, I suggest using `rvm` to do this:

http://rvm.io/rvm/upgrading

However, if you're running Mac(especially Mac OS X 10.9 Mavericks), I strongly suggest you using the following command to install & update `Ruby`:

Install `Homebrew` if you haven't done it yet:
```
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

Now install `rbenv`:
```
brew install rbenv ruby-build
```

Add `rbenv` to `bash_profile` so that it loads every time you open a terminal:
```
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile
source ~/.bash_profile
```

Install `Ruby` 2.1.2 and set it as the default version:
```
rbenv install 2.1.2
rbenv global 2.1.2
```

Now run:
```
ruby -v
```

It should return:
```
ruby 2.1.2
```

Which means you have successfully installed `Ruby` 2.1.2.

**Populate the database:**

Generate the code for `neo4j-shell`, and copy them into clipboard:
```
ruby processor.rb | pbcopy
```

Note that you might need to install some gems in order to run the code. For instance:
```
neography
neography-batch
solid_assert
byebug
...

```

Type `neo4j-shell` to enter the neo4j-shell:
```
Welcome to the Neo4j Shell! Enter 'help' for a list of commands
NOTE: Remote Neo4j graph database service 'shell' at port 1337

neo4j-sh (?)$ 
```
Then press `Ctrl + V` to paste the code into neo4j-shell:
```
......
......
neo4j-sh (?)$ match (pt:PositionType {id: 'ANY'}), (p:Position {id: '4469736E-6579-426B-6E31-3333374D4B50:8:1'})
> merge (pt)<-[:is_a]-(p);
+-------------------+
| No data returned. |
+-------------------+
Relationships created: 1
4 ms
```
This will run a bunch of code and populate the database.

*(Sadly, if you're running JVM with version higher than 1.7, you might have to revert it to version 1.7 in order to run neo4j-shell. This is the situation when I am writing this.)*

**Install Express and bower globally:**
```
sudo npm install -g express
sudo npm install -g bower
```

**Clone the folder from github:**
```
git clone https://github.com/xinghul/dBeacon-backend.git
cd dBeacon-backend
```

**Install node modules using npm:**
```
sudo npm install
```
This command will parse `package.json` and install all the node modules needed under the `node_modules/` directory:
```json
{
  "name": "dBeaconBackend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "express": "~4.2.0",
    "static-favicon": "~1.0.0",
    "morgan": "~1.0.0",
    "cookie-parser": "~1.0.1",
    "body-parser": "~1.0.0",
    "debug": "~0.7.4",
    "jade": "~1.3.0",
    "connect-multiparty": "~1.0.5",
    "neo4j": "~1.1.0",
    "request": "~2.36.0",
    "fast-csv": "~0.4.1",
    "forever": "0.11.x"
  }
}
```

**Install packages using bower:**
```
bower install
```
This command will parse `bower.json` and install packages including jQuery, Angular, Bootstrap and D3 under `public/bower_components`:
```json
{
  "name": "JudyBackend",
  "description": "Backend for Judy's database",
  "version": "1.0.0",
  "license": "NTG",
  "private": true,
  "dependencies": {
    "jquery": "2.1.x",
    "bootstrapvalidator": "0.5.x",
    "angular": "1.2.x",
    "angular-route": "1.2.x",
    "angular-loader": "1.2.x",
    "angular-mocks": "~1.2.x",
    "html5-boilerplate": "~4.3.0",
    "bootstrap": "3.2.x",
    "d3": "3.4.x"
  }
}
```

### **2. Start the server**

Simply run:
```
sudo npm start
```
It should output something like:
```
> dBeaconBackend@0.0.1 start /Users/User1/Documents/Projects/dBeacon-backend
> node ./bin/www

dBeacon server listening on port 3001
```
If you see the information above, which means you have a serve running on port 3001(you can change it later in bin/www), you should be able to visit the page:

http://localhost:3001/

Or, you can use `forever` to run the server, you might need to install `forever` globally first:
```
sudo npm install -g forever
```
Then, run `./run_forever`, it should return something like:
```
warn:    --minUptime not set. Defaulting to: 1000ms
warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
info:    Forever processing file: ./
```

You can set the parameters to avoid warnings. And you can run `forever list` to check the running processes:
```
info:    Forever processes running
data:        uid  command   script forever pid   logfile                        uptime      
data:    [0] qlYN npm start        91015   91016 /Users/User1/.forever/qlYN.log 0:0:0:2.130 
```

Note that you won't be able to stop the process by simply kill the process.

To stop the process, run `forever stop process_id`, `process_id` here stands for the corresponding process id. For example, the process id above is 0.

So you can stop the process above by simply run `foreve stop 0`.

### **3. REST APIs**

You can view all the available APIs in [index.js](routes/index.js).

Some of them might be deprecated and need a little modification in order to be used.
