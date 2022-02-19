<template>
    <div>
    </div>
</template>
<script>
// import { low } from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync';
//import {join, dirname} from 'path'
// import { join, dirname } from 'path'
//import { fileURLToPath } from 'url'
// import {StorageHelpers} from "@/core/Helpers";
// import {App} from "@/core/Constants";
// let db;

// const __dirname = dirname('ecSnippets')
// const adapter = new FileSync('db.json')
import lowdb from "lowdb"
// import FileSync from "lowdb/adapters/LocalStorage"

const adapter = new FileSync("db.json")
const db = lowdb(adapter)
console.log(adapter)
db.defaults({ commands: [] }).write()
export default {
    name: 'Api',
    loadDB: async function() {
        console.log('loading')
        await db.read()
    },
    addNewCommandItem (item) {
        db.get('commands').push(item).write()
    },
    getAllCommands () {
        const commands = db.get('commands').value()
        return commands
    },
    updateCommandItem (obj) {
        db.get('commands').find({id: obj.id}).assign(obj).write()
    },
    deleteCommandById (id) {
        db.get('commands').remove({id}).write()
    },
    getCommandById (id) {
        db.get('commands').find({id}).value()
    },
    getAllCommandsInTrash () {
        db.get('commands').filter({isTrash: true}).value()
    },
    getAllUntaggedCommands () {
        db.get('commands').filter({tags: "", isTrash: false} || {
            tags: null,
            isTrash: false
        }).value()
    },
    getAllFavoriteCommands () {
        db.get('commands').filter({isFavourite: true, isTrash: false}).value()
    },
    getAllTags () {
        this.db.get('commands').filter({isTrash: false}).map('tags').value()
    }, 
    getCommandsContainsTag () {
        tag => this.db.get('commands').filter((t => t.tags.indexOf(tag) > -1 && t.isTrash === false)).value()
    },
    queryCommand () {
        query => this.db.get('commands').filter((t => (t.title.toLowerCase().indexOf(query) > -1 || t.command.toLowerCase().indexOf(query) > -1) && t.isTrash === false)).value();
    }
}
</script>