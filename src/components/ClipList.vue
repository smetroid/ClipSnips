<template>
  <div class="scroll-enabled">
    <div
      scrollable
      @keydown.esc="close($event, $refs)"
      @keydown.stop="keyPress($event, $refs)"
      >
      <focus-trap v-model="listTrap">
        <div
          id="trapDiv" tabindex="-1">
          <v-data-table dense ref="list" :headers="headers"
            :items="history" item-key="id" :search="search"
            :items-per-page="itemsPerPage" 
            class="scroll-enabled" :page.sync="page"
            >
            <v-pagination
              v-model="page"
              :length="totalPages">
            </v-pagination>
            <template v-slot:top>
              <br/>
              <v-text-field
                @keypress.stop=""
                v-model="search" label="Search String (/)" class="x-4" />
            </template>
            <template v-slot:item="{ item }">
            <!--
            <template slot="{ item }" slot-scope="props">
            -->
              <tr
                item=item :class="selectedRowId == item.id?'orange':''" >
                <!--
                  displays items sent directly by the query, not in the order expected
                <td v-for="key in Object.keys(item)" :key="key">{{ item[key] }}</td>
                -->
                <!--
                  <td v-for="key in Object.keys(props.item)" :key="key">{{props.item[key]}}</td>
                <td>{{ item.id }}</td>
                -->
                <!--
                  <td v-if="!readMore[item.id] && 
                    `${item.clip.type}` === 'html'">
                      {{item.clip.html.substring(0, 200) + " ..."}}
                    <button x-small @click="showMore(item.id)" 
                      v-if="!readMore[item.id]" class="btn btn-primary">Show more
                    </button>
                    <button x-small @click="showLess(item.id)" 
                      v-if="readMore[item.id]" class="btn btn-primary">Show less
                    </button>
                    <br />
                    <span v-html="item.date"></span> | Tags 
                    <span v-html="item.tags"></span> | Favorite |
                    <span v-html="item.favorite"></span>
                    <v-icon small
                      class="mr-2"
                      @click="editItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon small
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </td>
                  -->
                  <td>
                    <div v-if="`${item.clip.type}` === 'text'">
                      <div v-if="item.clip.text.length > 200">
                        <div v-if="!readMore[item.id]">
                          {{item.clip.text.substring(0, 200) + " ..."}}
                          <v-btn v-if="!readMore[item.id]"
                            x-small color="primary" @click="showMore(item.id)" 
                            >Show more
                          </v-btn>
                        </div>
                      </div>
                      <div v-if="readMore[item.id]" >
                        {{ item.clip.text }}
                        <v-btn v-if="readMore[item.id]" x-small
                          color="primary" @click="showLess(item.id)" 
                          >Show less
                        </v-btn>
                      </div>
                      <span v-html="item.date"></span> | Tags 
                      <span v-html="item.tags"></span> | Favorite |
                      <span v-html="item.favorite"></span>
                      <v-icon small
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon small
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </div>
                    <div v-if="`${item.clip.type}` === 'html'">
                      <div v-if="item.clip.html.length > 200">
                        <div v-if="!readMore[item.id]">
                          <span v-html="item.clip.text.substring(0, 200)"></span>
                          <v-btn v-if="!readMore[item.id]"
                            x-small color="primary" @click="showMore(item.id)" 
                            >Show more
                          </v-btn>
                        </div>
                      </div>
                      <div v-if="readMore[item.id]" >
                        <span v-html=item.clip.html></span>
                        <v-btn v-if="readMore[item.id]" x-small
                          color="primary" @click="showLess(item.id)" 
                          >Show less
                        </v-btn>
                      </div>
                      <span v-html="item.date"></span> | Tags 
                      <span v-html="item.tags"></span> | Favorite |
                      <span v-html="item.favorite"></span>
                      <v-icon small
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon small
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </div>
                    <div v-if="`${item.clip.type}` === 'image'">
                      <v-dialog v-model='imageDialog'>
                        <v-img v-bind:src="`${item.clip.buffer}`" 
                        style="width: 800px; height:800px">
                        </v-img>
                        <v-btn v-if="readMore[item.id]" x-small
                          color="primary" @click="imageDialog = false" 
                          >Show less
                        </v-btn>
                      </v-dialog>
                      <div v-if="!readMore[item.id]">
                        <v-img v-bind:src="`${item.clip.thumbBuffer}`" 
                        style="width: 200px; height:200px">
                        </v-img>
                        <v-btn v-if="!readMore[item.id]"
                          x-small color="primary" @click="imageDialog = true" 
                          >Show more
                        </v-btn>
                        </div>
                      <div v-if="readMore[item.id]" >
                      </div>
                      <span v-html="item.date"></span> | Tags 
                      <span v-html="item.tags"></span> | Favorite |
                      <span v-html="item.favorite"></span>
                      <v-icon small
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon small
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </div>
                  </td>
                  <!--
                  <td v-if="readMore[item.id] &&
                    `${item.clip.type}` === 'image'">
                      <v-img v-bind:src="`${item.clip.thumbBuffer}`" 
                        style="width: 300px; height:300px"></v-img>
                      <br />
                    <v-btn v-if="!readMore[item.id]" x-small 
                      color="primary" outlined @click="showMore(item.id)" 
                      >Show more
                    </v-btn>
                    <v-btn v-if="readMore[item.id]" x-small 
                      color="primary" outlined @click="showLess(item.id)" 
                      >Show less
                    </v-btn>
                    <br />
                    <span v-html="item.date"></span> | Tags 
                    <span v-html="item.tags"></span> | Favorite |
                    <span v-html="item.favorite"></span>
                    <v-icon small
                      class="mr-2"
                      @click="editItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon small
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </td>
                  -->
              </tr>
            </template>
            <template v-slot:no-data>
              <!--
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              -->
            </template>
          </v-data-table>
        </div>
      </focus-trap>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
const { clipboard } = require('electron')
import { ClipboardWatcher } from '@/core/clipboard-watcher'
import crypto from 'crypto';
import Utils from '@/helpers/Utils'
let rendererChannel = null
import { DBApi } from '@/core/Api.js'
const db = new DBApi()
import {EVENT} from '@/core/cmdrConstants'
export default {
  name: 'ClipList',
  // NOTE: props need an array[] prop is a single string -EC-
  // props: ['active', 'test'],
  data () {
    return {
      imageDialog: false,
      readMore: {},
      listTrap: true,
      diagramListModal: true,
      focusedIndex: null,
      selectedRow: null,
      selectedRowId: null,
      search: '',
      smallDialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        diagram: '',
      },
      headers: [
        // {text: 'Id', value: 'id', sortable: false},
        // {text: 'Name', value: 'name', sortable: true},
        // {text: 'Description', value: 'description'},
        // {text: 'Created', value: 'created'},
        // {text: 'Updated', value: 'updated'},
      ],
      clips: [
                {
                  id: 'one',
                  name:'one',
                  description:'one',
                  createTime:'one',
                  updatedTime:'one'
                },
                {
                  id:'two',
                  name:'two',
                  description:'two',
                  createTime:'two',
                  updatedTime:'two'
                },
                {
                  id:'three',
                  name:'three',
                  description:'three',
                  createTime:'three',
                  updatedTime:'three'
                },
                {
                  id: 'one',
                  name:'<div> one <br/> two <br/> three <br /></div> <div> one <br/> two <br/> three <br /></div>',
                  createTime:'one',
                  updatedTime:'one'
                },
                {
                  id:'two',
                  name:'two',
                  description:'two',
                  createTime:'two',
                  updatedTime:'two'
                },
                {
                  id:'three',
                  name:'three',
                  description:'three',
                  createTime:'three',
                  updatedTime:'three'
                },
              ],
      history: [],
      searchQuery: null,
      page: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edited Item'
    },
    totalPages () {
      var pages = Math.ceil(this.history.length / this.itemsPerPage)
      return pages
    },
    newhistory() {
      if (this.searchQuery) {
        return this.history.filter((his) =>
          his.copiedText.toLowerCase().includes(this.searchQuery),
        )
      } else {
        return this.history.slice().reverse()
      }
    },
  },
  updated() {
    console.log('updated')
  },
  mounted () {
    const clipboardWatcher = new ClipboardWatcher()
    // clipboardWatcher.on('item', item => {
    //   rendererChannel.send(EVENT.ITEM_NEW, item);
    // });
    console.log(EVENT)
    console.log(rendererChannel)

    clipboardWatcher.startListening(this);

    // setInterval(this.scrapeClipboard, 2000)

    this.history = db.getAllCommands()
    this.diagramListModal = this.active == 'Open' ? 1 : 0
    this.$nextTick(function(){
      console.log('menuTrap active')
      this.listTrap = true
    })
    this.$root.$on('addItem', (entry) => {
      console.log('adding item on vue')
      db.addNewCommandItem(entry)
      // this.newItem(entry)
      //this.getAllItems()
      this.history = db.getAllCommands()
    })
  },
  methods: {
    showMore(id) {
      console.log('showMOre')
      this.$set(this.readMore, id, true);
    },
    showLess(id) {
        this.$set(this.readMore, id, false);
    },
    newItem (entry) {
      db.addNewCommandItem(entry)
    },
    getAllItems () {
      this.history = db.getAllCommands()
    },
    keyPress(event){
      //console.log(event)
      /*
      1. get list of tr's

        */
      //var tableRows = this.$refs.list.$el.querySelectorAll('tbody > tr')
      // var items = this.$refs.list.selectableItems.length
      //var items = this.$refs.list.items

      //console.log(items)
      switch(event.key){
        case '/':
          // data = {aciveWindow: "Menu", trap: 'd3ActionsTrap'}
          // console.log(component.activeWindow)
          //component.active = 'Menu'
          //component.menuTrap = true
          break;
          // return data
        case 'Escape':  //
          /*On escape setting activeWindow D3Dagre */
          // component.active = 'D3Dagre'
          // component.menuTrap = false
          // component.showMenu = false
          break
        // case 'j':
        //   this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, this.itemsPerPage)
        //   break
        // case 'k':
        //   this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, this.itemsPerPage)
        //   break
        // case 'l':
        //   this.page = Utils.getPage(this.page, event.key, this.totalPages)
        //   //this.focusedIndex = 0
        //   break
        // case 'h':
        //   this.page = Utils.getPage(this.page, event.key, this.totalPages)
        //   //this.focusedIndex = 0
        //   break
        case 'Enter':
          if (Utils.debug){
            // console.log('enter')
            // console.log(component.$refs.menu[component.gNavMenu])
            // console.log(component.gNavMenu)
            // console.log(component.selectedUrl)
          }
          // component.$refs.menu[component.gNavMenu].$el.click()
          // //this.addNodeFormVisible = true
          // //console.log(this.addNodeFormVisible)
          // // this.navAction(ref)
          // component.d3ActionsTrap = false
          // component.fab = false
          break
        case 'f':
          // var text = document.createTextNode('f')
          // let node = '<div class="hints"> ff </div>'
          //component.navActions = !component.navActions
          var hrefs = document.querySelectorAll('a')
          console.log(hrefs)
          //component.forwardHrefs(hrefs)
          // this.addFollowLinks()
          break
        default:
          console.log('App Event Key Default')
          //data = {aciveWindow: "Main", trap: ''}
          // return data
      }

      if (event.key === 'j' || event.key === 'k') {
        this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, this.itemsPerPage)
        console.log(this.$refs.list.selectableItems[this.focusedIndex])
        this.selectedRow = this.$refs.list.selectableItems[this.focusedIndex]
        this.selectedRowId = this.$refs.list.selectableItems[this.focusedIndex].id
      }

      if (event.key === 'l' || event.key === 'h') {
        this.page = Utils.getPage(this.page, event.key, this.totalPages)
      }

      if (event.key === 'Enter') {
        console.log("openDiagram")
        this.diagramListModal = false
        this.$root.$emit("openDiagram", this.selectedRowId)
        this.$root.$emit("changeActive")
      }

      if (event.key == "x"){
        console.log(this.$refs)
        this.deleteItem(this.selectedRow)
      }
    },
    save (){
    },
    editItem (item) {
      this.editedIndex = this.clips.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.smallDialog = true
      if(Utils.debug){
        console.log(item)
      }
    },
    deleteItem (item) {
      if (Utils.debug) {
        console.log(item)
      }
      db.deleteCommandById(item.id)
      this.history = db.getAllCommands()
      // const index= this.clips.indexOf(item)
      // console.log(index)
      // this.clips.splice(index, 1)
      // D3VimApi.deleteDiagram(this.selectedRowId)
    },
    filter (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().indexOf(search) !== -1
    },
    getDiagrams: async function() {
      // var result = await D3VimApi.getDiagrams()
      // console.log(result)
      // this.clips = result.data.dags
    },
    close () {
      console.log('Close method')
      this.diagramListModal = false
      this.loginTrapActive = false
      this.$root.$emit('changeActive')
      // this.$root.$emit('d3DagreActivate')
      // this.$root.$emit('showForm', 'node')
    },
    // Resetdatabase() {
    //   this.history = []
    //   database.remove({}, { multi: true }, function (err, numRemoved) {
    //     console.log(err)
    //     console.log(numRemoved)
    //     database.loadDatabase(function () {})
    //   })
    // },
    checkClipboard() {
      // const copiedText = clipboard.readText()
      // const found = (cmd) => cmd.title === copiedText
      //const cmds = db.getAllCommands()
      // if (cmds.some(found) == false && 
      //   copiedText.trim() != '' ) {

      //   console.log(uuid)

      //   var entry = { 
      //     id: uuid.v4(), 
      //     title: copiedText, 
      //     description: null,
      //     tags: null,
      //     isFavorite: false,
      //     isTrash: false,
      //     date: new Date().toLocaleString() 
      //   }

      //   db.addNewCommandItem(entry)
      //   //this.history.push(entry)
      //   this.$nextTick(function(){
      //     this.history = db.getAllCommands()
      //   })
      // }
    },
    getHash (data) {
      return crypto.createHash('sha256')
        .update(data)
        .digest('hex');
    },
    generateThumb (nativeImageData) {
      const aspectRatio = nativeImageData.getAspectRatio();

      const resizeOptions = {
        width: 300,
        height: 300
      };

      if (aspectRatio > 1) {
        // Landscape image
        resizeOptions.width /= aspectRatio;
      } else {
        // Portrait image
        resizeOptions.height /= aspectRatio;
      }

      const thumb = nativeImageData.resize(resizeOptions);
      return {
        thumbWidth: resizeOptions.width,
        thumbHeight: resizeOptions.height,
        thumbBuffer: thumb.toDataURL()
      };
    },
    getImageItem (nativeImageData) {
      return {
        type: 'image',
        ...nativeImageData.getSize(),
        buffer: nativeImageData.toBitmap()
      };
    },
    areItemsEqual (oldItem, newItem) {
      if (oldItem && newItem) {
        if (oldItem.type === newItem.type) {
          if (oldItem.type === 'image') {
            return (oldItem.buffer.equals(newItem.buffer));
          }

          if (oldItem.type === 'text') {
            return (
              oldItem.text === newItem.text &&
              oldItem.html === newItem.html &&
              oldItem.rtf === newItem.rtf
            );
          }
        }
      }

      return false;
    },
    scrapeClipboard() {
      const availableFormats = clipboard.availableFormats();

      if (availableFormats.length === 0) {
        return;
      }

      let newClipItem = {};
      let clipboardImage = null;

      if (availableFormats.find(pattern => pattern.startsWith('image/'))) {
        clipboardImage = clipboard.readImage();
        newClipItem = this.getImageItem(clipboardImage);
      } else if (availableFormats.find(pattern => pattern.startsWith('text/'))) {
        newClipItem = {
          type: 'text',
          text: clipboard.readText(),
          html: clipboard.readHTML(),
          rtf: clipboard.readRTF()
        };

        if (!newClipItem.text.trim()) {
          return;
        }
      }

      if (this.areItemsEqual(this._recentClipItem, newClipItem)) {
        return;
      }

      newClipItem.timestamp = Date.now();
      this._recentClipItem = newClipItem;

      if (newClipItem.type === 'image') {
        const thumb = this.generateThumb(clipboardImage);
        Object.assign(newClipItem, thumb);
        newClipItem.hash = this.getHash(newClipItem.thumbBuffer);

        this.emit('item', {
          ...newClipItem,
          buffer: clipboardImage.toDataURL()
        });
      } else {
        newClipItem.hash = this.getHash(newClipItem.text);
        this.emit('item', newClipItem);
      }
    },
    itemClicked(item) {
      clipboard.writeText(item.copiedText)
      ipcRenderer.send('minimize')
    },
    inputChange: function (event) {
      this.searchQuery = event.target.value
    },
  },
  watch: {
    // active: function () {
    //   console.log('diagram list')
    //   console.log(this.activeWindow)
    //   this.diagramListModal = this.active == "Open"?true:false
    //   this.$nextTick(function(){
    //     console.log('menuTrap active')
    //     this.listTrap = this.diagramListModal
    //   })
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll_enabled {
    overflow: scroll;
    height: 1000px; /* define your custom height */
}

.scroll_enabled::-webkit-scrollbar {
    width: 20px;
}
.scroll_enabled::-webkit-scrollbar-corner {
    background: rgba(0,0,0,0);
}
.scroll_enabled::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
    border: 4px solid rgba(0,0,0,0);
    background-clip: content-box;
    min-width: 32px;
    min-height: 32px;
}
.scroll_enabled::-webkit-scrollbar-track {
    background-color: rgba(0,0,0,0);
}
</style>
