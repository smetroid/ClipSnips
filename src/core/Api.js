import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
let db;

export class DBApi {
    constructor() {
        const adapter = new FileSync("cmdrdb.json")
        db = lowdb(adapter)
        console.log(adapter)
        db.defaults({ commands: [] }).write()
        // const dbFilePath = path.join(StorageHelpers.preference.get('storagePath'), App.dbName);
        // const adapter = new FileSync(dbFilePath);
        // db = lowdb(adapter);
        // db.defaults({commands: []}).write();
    }

    addNewCommandItem = item => db.get('commands').push(item).write();

    updateCommandItem = obj => db.get('commands').find({id: obj.id}).assign(obj).write();

    deleteCommandById = id => db.get('commands').remove({id}).write();

    getCommandById = id => db.get('commands').find({id}).value();

    getAllCommands = () => db.get('commands').filter({isTrash: false}).value();

    getAllCommandsInTrash = () => db.get('commands').filter({isTrash: true}).value();

    getAllUntaggedCommands = () => db.get('commands').filter({tags: "", isTrash: false} || {
        tags: null,
        isTrash: false
    }).value();

    getAllFavouriteCommands = () => db.get('commands').filter({isFavourite: true, isTrash: false}).value();

    getAllTags = () => db.get('commands').filter({isTrash: false}).map('tags').value();

    getCommandsContainsTag = tag => db.get('commands').filter((t => t.tags.indexOf(tag) > -1 && t.isTrash === false)).value();

    queryCommand = query => db.get('commands').filter((t => (t.title.toLowerCase().indexOf(query) > -1 || t.command.toLowerCase().indexOf(query) > -1) && t.isTrash === false)).value();
}

//export default Api;