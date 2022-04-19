<template>
    <div
      @keydown.alt="keyPress($event)"
      @keypress.stop.prevent="keyPress($event)"
    >
      <focus-trap v-model="joplinListTrap" ref="trap" style="outline: none;">
        <div class="ma-1 pa-0"
          id="trapDiv" tabindex="-1">
          <v-data-table dense ref="list" 
            :headers="headers"
            :items="snippets.items" 
            item-key="id" 
            :search="search"
            :items-per-page="itemsPerPage" 
            class="elevation-5" 
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
              <tr>
                <div 
                  :class="selectedRowId == item.id?'rowSelected blue-grey':''">
                </div>
                  <td class="ma-0 pa-1">
                    <div>
                      <v-dialog 
                        v-model="readMore[item.id]"
                        >
                        <v-card 
                          class="scroll_enabled ma-0 pa-1"> 
                          <span v-html="toHtml(item.body)">
                          </span>
                        </v-card>
                      </v-dialog>
                      <div v-if="!readMore[item.id]">
                        <v-card
                          max-height="100px"
                          class="scroll_enabled ma-0 pa-1"> 
                            <span v-html="toHtml(item.body)" />
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
                              v-html="date(item.updated_time)"></span>
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
import Utils from '@/helpers/Utils'
import { DBApi } from '@/core/Api.js'
const db = new DBApi()
import goTo from 'vuetify/lib/services/goto'
import JoplinApi from '@/core/JoplinApi'
import { marked } from 'marked';
// import { MarkupToHtml } from 'joplin-renderer'
import { forEach } from 'lodash'

// import * as easings from 'vuetify/lib/services/goto/easing-patterns'
export default {
  name: 'JoplinSnipList',
  // NOTE: props need an array[] prop is a single string -EC-
  // props: ['active', 'test'],
  data () {
    return {
      imageDialog: false,
      readMore: {},
      joplinListTrap: false,
      diagramListModal: true,
      focusedIndex: null,
      selectedRow: null,
      selectedRowId: null,
      search: '',
      smallDialog: false,
      editedIndex: -1,
      // the value of 'body' is what is field that is being searched
      headers: [
        {text: 'Snippets', value: 'body', sortable: false, align: ' d-none'},
      ],
      snippets: [],
      page: 1,
      itemsPerPage: 5,
      goToVar: 100,
      hideClipSnip: true,
      tags: true
    }
  },
  mounted: async function()  {
    this.snippets = await JoplinApi.getAllSnippetNotes()
    console.log((this.snippets.length))

    this.$nextTick(function(){
      console.log('menuTrap active')
      this.joplinListTrap = true
    })

    this.$root.$on('sendFocusToDataTable', () => {
      console.log('datatableFocus')
      this.joplinlistTrap = true
    })
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edited Item'
    },
    totalPages () {
      console.log(this.snippets.length)
      var pages = Math.ceil(this.snippets.length / this.itemsPerPage)
      return pages
    },
    itemDiff () {
      var items = (this.page * this.itemsPerPage) - this.snippets.length
      return items
    },
  },
  updated() {
    console.log('updated')
  },
  methods: {
    date (item) {
      var date = new Date(item)
      date = date.toISOString().split('T')[0]
      return date
    },
    toHtml (item) {
      // Working on getting the joplin rederer to work 
      //const options = {}
      //const theme = {}
      //const markupToHTML = new MarkupToHtml(options)
      //var result = await markupToHTML.render(MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN, item, theme, options)
      //console.log(result)
      //return result.html
      var parsed = marked.parse(item)
      return parsed
    },
    async getAllTags () {
      var tagData = []
      tagData = await JoplinApi.getAllTags()
      forEach((tag) => {
        tagData.push(tag.title)
      })
      this.tags = tagData
    },
    getSnippet (snippet_body) {
      var data = {}
      const body = marked.lexer(snippet_body)
      var codeBlocks = body.filter(obj => obj.type === 'code')

      // The first block is always the snippet code
      var snippet = codeBlocks[0]
      data.snippet = snippet
      // The options are always the second block
      var snipOptions = codeBlocks[1]
      data.options = snipOptions
      return data
    },
    showMore(id) {
      this.$set(this.readMore, id, true);
    },
    showLess(id) {
        this.$set(this.readMore, id, false);
    },
    newItem (entry) {
      db.addNewCommandItem(entry)
      this.snippets = db.getAllCommands()
    },
    getAllItems () {
      this.snippets = db.getAllCommands()
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
        console.log(this.page)
        console.log(this.totalPages)
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

      if (event.key === 'm') {
        if(this.readMore[this.selectedRowId]){
          this.showLess(this.selectedRowId)
        } else {
          this.showMore(this.selectedRowId)
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
      if (event.altKey === true && event.key === 'n') {
        this.listTrap = false
        this.$root.$emit('sendFocusToMenu')
      } else if (event.key === 'n') {
        this.$root.$emit('showClipformDialog')
      }

      // Create new ClipSnippet out of the clip data
      if (event.key === 'c') {
        this.$root.$emit('showClipformDialog')
      }

      if (event.key === 'y') {
        console.log(this.selectedRow.body)
        var data = this.getSnippet(this.selectedRow.body)
        console.log(data)
        console.log(this.selectedRow.clip.text)
        console.log(this.selectedRowId)
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
      this.snippets = db.getAllCommands()
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
