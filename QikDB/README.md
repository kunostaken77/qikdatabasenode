Fast and easy to use JSON database.




__Setup:__ 

1. Require "DB" class from the qikdb package.
2. Create new instance of a DB.
3. Insert a config object in the constructor's params.

(Params include: 

"name" - Sets the name of the database.

"basepath" -  Sets the file name,

"directory" (folder) - Sets directory/folder name.)


__Usage:__

"all" - Returns all keys from the database.

"get" - Takes one parameter (key), returns key's value in the database.

"set" - Takes two parameters (key), and (data) sets a key's value in the database (overwrites any pre existing data stored for key).

"add" - Takes two parameters (key), and (data) adds to a key's value in the database. (Data parameter and key's pre existing value must be a number).

"subtract" - Takes two parameters (key), and (data) subtracts from a key's value in the database. (Data parmeter and key's pre-existing value must be a number).

"exists" - Takes one parameter (key) returns true if key exists in DB, returns false if not.

"delete" - Takes one parameter (key) deletes given key from database (Can take "all" as the key to delete all keys from the database).

"unlink" - Deletes all keys from database, and database file.

__Notes:__

1. All class functions listed above are asynchronous (Excluding "unlink" function).
2. The set, add, and subtract function(s) return the new value of the key allowing it to be assigned to a variable.
3. The delete, and unlink functions return true.
