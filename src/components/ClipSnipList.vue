<template>
    <div
      @keydown.alt="keyPress($event)"
      @keypress.stop.prevent="keyPress($event)"
    >
      <focus-trap v-model="listTrap" ref="trap" style="outline: none;">
        <div class="ma-1 pa-0"
          id="trapDiv" tabindex="-1">
          <v-data-table dense ref="list" 
            :headers="headers"
            :items="history" 
            item-key="id" 
            :search="search"
            :items-per-page="itemsPerPage" 
            class="scroll-enabled elevation-5" 
            :page.sync="page"
            width="400px"
            >
            <v-pagination
              v-model="page"
              :length="totalPages">
            </v-pagination>
            <template v-slot:top>
              <v-text-field 
                class-x-4
                ref="search"
                @keypress.stop=""
                @keydown.esc="keyPress($event)"
                v-model="search" 
                label="Search String (/)" 
                append-icon="mdi-magnify"
                />
            </template>
            <template v-slot:item="{ item }">
            <!--
            <template slot="{ item }" slot-scope="props">
            -->
              <tr
                item=item 
                >
                <div 
                  :class="selectedRowId == item.id?'rowSelected blue-grey':''">
                </div>
                <!--
                  displays items sent directly by the query, not in the order expected
                <td v-for="key in Object.keys(item)" :key="key">{{ item[key] }}</td>
                -->
                <!--
                  <td v-for="key in Object.keys(props.item)" :key="key">{{props.item[key]}}</td>
                <td>{{ item.id }}</td>
                -->
                  <td class="ma-0 pa-1">
                    <div v-if="`${item.clip.type}` === 'text'">
                      <v-dialog 
                        v-model="readMore[item.id]"
                        >
                        <v-card 
                          class="scroll_enabled ma-0 pa-1"> 
                          <span v-html="item.clip.html">
                          </span>
                        </v-card>
                      </v-dialog>
                      <div v-if="!readMore[item.id]">
                        <v-card
                          max-height="100px"
                          class="scroll_enabled ma-0 pa-1"> 
                          <div v-if="`${item.clip.html}` === ''"> 
                            {{ item.clip.text }}
                          </div>
                          <div else >
                            <span v-html="item.clip.html" />
                          </div>
                        </v-card>
                      </div>
                      <v-container fluid class="ma-0 pt-2">
                        <v-row
                          align-content="center"
                          justify="space-between" 
                          dense
                          >
                          <v-col cols="4">
                            <span 
                              class="blue--text text--lighten--1" 
                              v-html="item.date"></span>
                          </v-col>
                          <v-col>
                            <span 
                            class="orange--text"> Tags </span>  
                          </v-col>
                          <v-col>
                            <v-icon 
                              color="yellow">mdi-star-outline
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-icon small
                              class="mr-2"
                              color="green"
                              @click="editItem(item)"
                            >mdi-pencil
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-icon small
                              color="red"
                              @click="deleteItem(item)"
                            >mdi-delete
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-btn 
                              v-if="readMore[item.id]" 
                              x-small
                              outlined
                              @click="imageDialog = false" 
                              >Show less (m)
                            </v-btn>
                            <v-btn 
                              v-if="!readMore[item.id]"
                              outlined
                              x-small
                              @click="imageDialog = true" 
                              >Show more (m)
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </div>
                    <div v-if="`${item.clip.type}` === 'image'">
                      <v-dialog v-model='imageDialog'>
                        <v-img v-bind:src="`${item.clip.buffer}`" 
                          style="width: 800px; height:800px">
                        </v-img>
                      </v-dialog>
                      <div 
                        v-if="!readMore[item.id]">
                        <v-img v-bind:src="`${item.clip.thumbBuffer}`" 
                        style="width: 200px; height:200px">
                        </v-img>
                      </div>
                      <v-container fluid class="ma-0 pt-1">
                        <v-row 
                          justify="space-between" 
                          dense
                          >
                          <v-col cols="4">
                            <span 
                              class="blue--text text--lighten--1" 
                              v-html="item.date"></span>
                          </v-col>
                          <v-col>
                            <span 
                            class="orange--text"> Tags </span>  
                          </v-col>
                          <v-col>
                            <v-icon 
                              color="yellow">mdi-star-outline
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-icon
                              small
                              class="mr-2"
                              color="green"
                              @click="editItem(item)"
                            >mdi-pencil
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-icon
                              small
                              color="red"
                              @click="deleteItem(item)"
                            >mdi-delete
                            </v-icon>
                          </v-col>
                          <v-col>
                            <v-btn 
                              v-if="readMore[item.id]" 
                              x-small
                              outlined
                              @click="imageDialog = false" 
                              >Show less (m)
                            </v-btn>
                            <v-btn 
                              v-if="!readMore[item.id]"
                              outlined
                              x-small
                              @click="imageDialog = true" 
                              >Show more (m)
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </div>
                  </td>
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
</template>
<script>
// const { ipcRenderer } = require('electron')
// const { clipboard } = require('electron')
import { ClipboardWatcher } from '@/core/clipboard-watcher'
import Utils from '@/helpers/Utils'
let rendererChannel = null
import { DBApi } from '@/core/Api.js'
const db = new DBApi()
import {EVENT} from '@/core/cmdrConstants'
import goTo from 'vuetify/lib/services/goto'
// import * as easings from 'vuetify/lib/services/goto/easing-patterns'
export default {
  name: 'ClipSnipList',
  // NOTE: props need an array[] prop is a single string -EC-
  // props: ['active', 'test'],
  data () {
    return {
      imageDialog: false,
      readMore: {},
      listTrap: false,
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
        {text: 'SnipClip', value: 'clip.html', sortable: true, align: ' d-none'},
        // {text: 'Description', value: 'description'},
        // {text: 'Created', value: 'created'},
        // {text: 'Updated', value: 'updated'},
      ],
      //clips: [
      //          {
      //            id: 'one',
      //            name:'one',
      //            description:'one',
      //            createTime:'one',
      //            updatedTime:'one'
      //          },
      //          {
      //            id:'two',
      //            name:'two',
      //            description:'two',
      //            createTime:'two',
      //            updatedTime:'two'
      //          },
      //          {
      //            id:'three',
      //            name:'three',
      //            description:'three',
      //            createTime:'three',
      //            updatedTime:'three'
      //          },
      //          {
      //            id: 'one',
      //            name:'<div> one <br/> two <br/> three <br /></div> <div> one <br/> two <br/> three <br /></div>',
      //            createTime:'one',
      //            updatedTime:'one'
      //          },
      //          {
      //            id:'two',
      //            name:'two',
      //            description:'two',
      //            createTime:'two',
      //            updatedTime:'two'
      //          },
      //          {
      //            id:'three',
      //            name:'three',
      //            description:'three',
      //            createTime:'three',
      //            updatedTime:'three'
      //          },
      //        ],
      history: [],
      page: 1,
      itemsPerPage: 5,
      goToVar: 100,
      hideClipSnip: true
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
    itemDiff () {
      var items = (this.page * this.itemsPerPage) - this.history.length
      return items
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
    this.$root.$on('addItem', (entry) => {
      console.log('adding item on vue')
      this.newItem(entry)
    })

    this.$root.$emit('sendFocusToDataTable', () => {
    })

    this.$nextTick(function(){
      console.log('menuTrap active')
      this.listTrap = true
    })
  },
  methods: {
    showMore(id) {
      this.$set(this.readMore, id, true);
    },
    showLess(id) {
        this.$set(this.readMore, id, false);
    },
    newItem (entry) {
      db.addNewCommandItem(entry)
      this.history = db.getAllCommands()
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
          break;
          // return data
        case 'Escape':  //
          break
        case 'Enter':
          if (Utils.debug){
            // console.log('enter')
            // console.log(component.$refs.menu[component.gNavMenu])
            // console.log(component.gNavMenu)
            // console.log(component.selectedUrl)
          }
          break
        case 'f':
          var hrefs = document.querySelectorAll('a')
          console.log(hrefs)
          break
        default:
          console.log('App Event Key Default')
      }

      if (event.key === 'Escape'){
        console.log('esc')
        // console.log(this)
        this.$refs.search.blur()
        this.$refs.trap.$el.focus()
      }

      if (event.key === '/') {
        this.$refs.search.focus()
        goTo(0, this.options)
      }

      if (event.key === 'j' || event.key === 'k') {
        if ( this.itemDiff > 0 ) {
          var itemsInPage = this.itemsPerPage - this.itemDiff
          this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, itemsInPage)
        } else {
          this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, this.itemsPerPage)
        }

        this.selectedRow = this.$refs.list.selectableItems[this.focusedIndex]
        this.selectedRowId = this.$refs.list.selectableItems[this.focusedIndex].id
        this.goToVar = (this.focusedIndex * 100)
        goTo(this.goToVar, this.options)
      }

      if (event.key === 'l' || event.key === 'h') {
        this.page = Utils.getPage(this.page, event.key, this.totalPages)
      }

      if (event.key === 'Enter') {
        //console.log("openDiagram")
        //this.diagramListModal = false
        //this.$root.$emit("openDiagram", this.selectedRowId)
        //this.$root.$emit("changeActive")
      }

      if (event.key === 'x') {
        console.log(this.$refs)
        this.deleteItem(this.selectedRow)
      }

      if (event.altKey === true && event.key === 'm') {
        this.listTrap = false
        this.$root.$emit('sendFocusToMenu')
      } else if (event.key === 'm') {
        console.log(this.selectedRow.clip.type)
        if (this.selectedRow.clip.type === 'image') {
          if(this.readMore[this.selectedRowId]){
            this.imageDialog = false
          } else {
            this.imageDialog = true
          }
        } else {
          if(this.readMore[this.selectedRowId]){
            this.showLess(this.selectedRowId)
          } else {
            this.showMore(this.selectedRowId)
          }
        }
      }

      if (event.key === 'e') {
        this.formDialog
        this.$root.$emit('showClipformDialog', this.selectedRowId)
        //var item = db.getCommand(this.selectedRowId)
      }

      if (event.shiftKey === true && event.key === '?') {
        this.$root.$emit('showShortcutDialog')
      }

      if (event.altKey === true && event.key === 's') {
        this.$root.$emit('showSettingsDialog')
      }

      // Create new ClipSnippet
      if (event.key === 'n') {
        this.$root.$emit('showClipformDialog')
      }

      // Create new ClipSnippet out of the clip data
      if (event.key === 'c') {
        this.$root.$emit('showClipformDialog')
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
    options () {
      return {
        duration: 734,
        offset: -168,
        easing: 'easeInOutCubic'
      }
    }
    // Resetdatabase() {
    //   this.history = []
    //   database.remove({}, { multi: true }, function (err, numRemoved) {
    //     console.log(err)
    //     console.log(numRemoved)
    //     database.loadDatabase(function () {})
    //   })
    // },
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
.rowSelected {
  display: table-cell;
  /*
  border-radius: 10px;
  box-shadow: 0 0 10px #9ecaed;
  background: orange;
  */
  width: 5px
}
</style>
<style lang="scss">  
  tbody {
     tr:hover {
        background-color: transparent !important;
     }
  }
</style>
