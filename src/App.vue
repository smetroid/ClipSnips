<template>
  <v-app>
    <focus-trap v-model="drawerTrap">
      <div 
        id="trapDiv" tabindex="-1"
        @keydown.stop.prevent="keyPress($event, $refs.nav)"
        @keypress.stop.prevent="keyPress($event, $refs.nav)"
        >
        <v-navigation-drawer
          class="rows"
          app
          permanent
          :mini-variant.sync="mini"
        >
          <div class="d-flex flex-column justify-space-between align-center">
            <v-img 
              src="./assets/OSFLogoV6.png"
              max-height="50"
              max-width="50"
              >
            </v-img>
          </div>
          <v-divider></v-divider>
          <v-list nav dense>
            <v-list-item link
              x-small
              ref="nav"
              v-for="(link, i) in menuLinks"
              :key="i"
              :class="currentMenuLink == link.name?'blue-grey':''"
              @click="navigate(link.name)"
            >
              <v-list-item-icon>
                <v-icon v-text="link.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text=link.name></v-list-item-title>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
        </v-navigation-drawer>
      </div>
    </focus-trap>

    <!--
    <v-app-bar class="ml-13 pa-0">
        <v-tabs fixed-tabs dark>
          <v-tab>
            ClipSnips
          </v-tab>
          <v-tab>
            Clipboard
          </v-tab>
          
        </v-tabs>
    </v-app-bar>
    -->

    <!-- Sizes your content based upon application components -->
    <v-main class="ml-13 pa-0">
      <v-card>
        <v-dialog 
          scrollable
          max-width="700px"
          v-model="shortcutDialog">
          <v-card class="ma-0 pa-3">
            <Shortcuts />
          </v-card>
        </v-dialog>
      </v-card>
      <v-card>
        <v-dialog 
          max-width="600px"
          v-model="settingsDialog">
          <v-card>
            <Settings />
          </v-card>
        </v-dialog>
      </v-card>
      <v-card>
        <ClipSnipList />
      </v-card>
      <v-card>
        <v-dialog style="overflow-y: hidden"
          v-model="formDialog">
        <ClipSnipForm
          :id="snipClipId"
        />
        </v-dialog>
      </v-card>

      <!-- Provides the application the proper gutter -->
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
import Utils from '@/helpers/Utils'
import ClipSnipList from '@/components/ClipSnipList'
import Shortcuts from '@/components/Shortcuts'
import Settings from '@/components/Settings'
import ClipSnipForm from '@/components/ClipSnipForm'
import Store from 'electron-store';

export default {
  name: 'App',
  components: {
    ClipSnipList,
    Shortcuts,
    Settings,
    ClipSnipForm
  },
  data () {
    return {
      menuLinks: [
        {"icon":"mdi-plus-thick","name":"New CMD Snippet"},
        {"icon":"mdi-view-list","name":"All CMD Snips"}, 
        {"icon":"mdi-star","name":"Favorites"}, 
        {"icon":"mdi-tag-multiple","name":"Untagged"},
        {"icon":"mdi-trash-can","name":"Deleted"},
        {"icon":"mdi-cog","name":"Settings"}
        ],
      currentMenuLink: null,
      drawerTrap: false,
      mini: true,
      focusedIndex: null,
      shortcutDialog: false,
      settingsDialog: false,
      formDialog: false,
      snipClipId: null,
      joplinEnabled: false,
    }
  },
  mounted () {
    this.$root.$on('sendFocusToMenu', () => {
      this.mini = false
      console.log('menuTrap active')

      /** the hidden menu is not renderd, therefore can't enable the trap 
       * 
      */
      this.$nextTick(function(){
        console.log('menuTrap active')
        this.drawerTrap = true
      })
    }) 
    this.$root.$on('showShortcutDialog', () => {
      this.shortcutDialog = true
    }) 
    this.$root.$on('settingsDialog', (bool) => {
      console.log('settingsDialog active')
      this.settingsDialog = bool
      this.esc()
    }) 
    this.$root.$on('showClipformDialog', (id) => {
      this.formDialog = true
      this.snipClipId = id
    }) 

    var settings = new Store()
    try{
      console.log('joplinEnabled')
      this.joplinEnabled = settings.get('joplingEnabled')
    } catch (error) {
      console.log('joplin not enabled')
      console.log(error)
    }

  },
  methods: {
    keyPress (event) {
      console.log(event)
      console.log('kepress')
      console.log(this.$refs.nav)
      if (event.key == "j" || event.key == "k") {
        this.focusedIndex = Utils.getIndex(this.focusedIndex, event.key, this.menuLinks.length)
        console.log(this.focusedIndex)
        this.currentMenuLink = this.menuLinks[this.focusedIndex].name
      }

      if ((event.altKey === true && event.key === 'm') ||
          (event.key === 'Escape')) {
            console.log('esc')
        this.esc()
      }
      if (event.shiftKey === true && event.key === '?') {
        this.sortcutDialog = true
      }
      if (event.key === 'Enter') {
        console.log('enter')
        this.drawerTrap = false
        this.settingsDialog = true
      }
    },
    navigate (link) {
      console.log(link)
      this.currentMenuLink = link
    },
    esc (){
      this.mini = true
      this.drawerTrap = false
      this.$root.$emit('sendFocusToDataTable')
    }
  }
}
</script>
<style scoped>
</style>