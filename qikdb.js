const json = require("json");
const fs = require("fs");

class DB {

  constructor(config) {
    if (typeof(config) === "object") {
      this.name = config["name"];
      // If the user entered a basepath.
      if (config["basepath"]) {
        if (config["basepath"].includes(".json")) {
          this.basepath = `${config["basepath"]}`;
        } else {
          this.basepath = `${config["basepath"]}.json`
        }
      } else {
        this.basepath = `${this.name}.json`;
      };

      // If the user entered a directory/folder.
      if (config["directory"] || config["folder"]) {
        if (config["directory"].includes("./") || config["folder"].includes("./")) {
          this.directory = config["directory"] || config["folder"];

          if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory);          
          }
        } else {
          this.directory = `./${this.directory}`;
        }
      } else {
        this.directory = "./";
      }

      this.path = `${this.directory}/${this.basepath}`;

      if (!fs.existsSync(this.path)) {
        let iData = {mData: []};
        let fData = JSON.stringify(iData);

        fs.writeFileSync(this.path, fData);
        }
    } else {
      config_type = typeof(config);
      console.log(`\u001b[31mError: expected type \"object\", got \"${config_type}\".`)
    }
  };

  /**
   *@name all
   *@description Get's all keys from the database.
   */
    all() {
      if (!fs.existsSync(this.path)) {
        let iData = {mData: []};
        let fData = JSON.stringify(iData);
        fs.writeFileSync(this.path, fData);
      } 
        let fData = fs.readFileSync(this.path)
        
        return JSON.parse(fData);
    };
  /**
   * @name get
   * @description Get's a key from the database.
   */
    get(key) {
      return new Promise((resolve, reject) => {
        let arr = this.all()["mData"];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["key"] == key) {
            resolve(arr[i]["data"]);
          }
        }
        this.set(key, 0);
        resolve(0);
        });
    }
    
  /** 
   * @name set
   * @description Sets a key's value in the database.
   */
    set(key, data) {
      return new Promise((resolve, reject) => {
        let arr = this.all()["mData"];
        let found = false;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["key"] == key) {
            arr[i]["data"] = data;

            let iData = {mData: arr};

            let fData = JSON.stringify(iData);
            fs.writeFileSync(this.path, fData);

            resolve(fData);
            found = true;
          }
        }
        if (!found){
          arr.push({key: key, data: data});

          let iData = {mData: arr};

          let fData = JSON.stringify(iData);
          fs.writeFileSync(this.path, fData);
          resolve(fData);
        }
      })
  }
  
  /**
   * @name add
   * @description Adds a number value to a pre existing number in the database.
   */
    add(key, data) {
      return new Promise((resolve, reject) => {
        let arr = this.all()["mData"];

        for (let i = 0; i < arr.length; arr++) {
          if (arr[i]["key"] == key) {
            if (typeof arr[i]["data"] == "number" && typeof data == "number") {
              arr[i]["data"] += data

              let iData = {mData: arr};

              let fData = JSON.stringify(iData);
              fs.writeFileSync(this.path, fData);

              resolve(arr[i]["data"]);
            } else {
              if (typeof data != "number") {
                reject(`\u001b[31mError: expected type \"number\", got ${typeof data}.`);
              } else {
                reject(`\u001b[31mError: can\'t add type \"number\" to type \"${typeof arr[i]["data"]}\".`);
              }
              
            }
          }
        }
      })
    }

  /**
   * @name subtract
   * @description Subtracts a number value from a pre existing number in the database.
   */
  
    subtract(key, data) {
      return new Promise((resolve, reject) => {
        let arr = this.all()["mData"];

        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["key"] == key) {
            if (typeof arr[i]["data"] == "number" && typeof data == "number") {
              arr[i]["data"] -= data;

              let iData = {mData: arr};

              let fData = JSON.stringify(iData);
              fs.writeFileSync(this.path, fData);
              
              resolve(arr[i]["data"]);

            } else {
              if (typeof data != "number") {
                reject(`\u001b[31mError: expected type \"number\", got ${typeof data}.`);
              } else {
                reject(`\u001b[31mError: can\'t add type \"number\" to type \"${typeof arr[i]["data"]}\".`);
              }
            }
          }
        }
      })
    }

  /**
   * @name exists
   * @description Checks if a key is existent in the database, and returns a boolean value.
   */
    exists(key) {
      return new Promise((resolve) => {
        let arr = this.all()["mData"];

        for (let i = 0;  i < arr.length; i++) {
          if (arr[i]["key"] == key) {
            resolve(true);
          }
        }

        resolve(false);
      })

    }
  /**
    * @name delete
    * @description Deletes a given key in the database.
    */
    delete(key) {
      return new Promise((resolve, reject) => {
        if (key == "all") {
          fData = {mData: []};

          fs.writeFileSync(this.path, fData);

          resolve(fData);
        }

        let arr = this.all()["mData"];

        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["key"] == key) {
            arr = arr.splice(i, i);
            let iData = {mData: arr};

            let fData = JSON.stringify(iData);
            fs.writeFileSync(this.path, fData);

            resolve(fData);
          }
        }
        reject(`\u001b[31mError: key ${key} not found in database.`);
      });
    };

  /**
   * @name unlink
   * @description Unlinks a database, deleting it's file and all associated data.
   */
    unlink() {
      fs.unlinkSync(this.path);
      return true;
    }
  
};

module.exports = DB;
