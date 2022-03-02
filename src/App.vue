<template>
  <v-app>
    <div>
      <focus-trap v-model="drawerTrap">
        <div 
          id="trapDiv" tabindex="-1"
          @keydown.stop.prevent="keyPress($event, $refs.nav)"
          @keypress.stop.prevent="keyPress($event, $refs.nav)"
          >
          <v-navigation-drawer
            app
            permanent
            :mini-variant.sync="mini"
          >
            <b>CMD<br />
              Snips</b>
            <v-divider></v-divider>
            <v-list nav dense>
              <v-list-item link
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
    </div>

    <!--
    <v-app-bar class="ml-13 pa-0">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
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
        <ClipSnipForm
          :id="snipClipId"
        />
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
      clipformDialog: false,
      snipClipId: null
    }
  },
  mounted () {
    this.$root.$on('sendFocusToMenu', () => {
      this.drawer = true
      this.mini = false
      this.$nextTick(function(){
        console.log('menuTrap active')
        this.drawerTrap = true
      })
    }) 
    this.$root.$on('showShortcutDialog', () => {
      this.shortcutDialog = true
    }) 
    this.$root.$on('showSettingsDialog', () => {
      this.settingsDialog = true
    }) 
    this.$root.$on('showCliformDialog', (id) => {
      this.clipformDialog = true
      this.snipClipId = id
    }) 
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
          (event.key === 'esc')) {
        this.esc()
      }
      if (event.shiftKey === true && event.key === '?') {
        this.sortcutDialog = true
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
