<template>
  <focus-trap 
    v-model="settingsTrap" 
    >
  <v-container>
    <v-row justify="center" >
      <v-col class="ma-0 pa-0">
          <v-card 
            class="scroll_enabled"
            min-height="300px">
            <v-card-title>
              <span class="text-h5">Settings</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-switch
                      required
                      label="Save On Exit"
                      v-model="saveOnExit"
                    >
                    </v-switch>
                    <v-text-field
                      v-model="fileLocation"
                      required
                      label="Settings File Location"
                      rules.fileLocation
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-divider />
                <v-row>
                  <v-col>
                    <v-switch
                      label="Joplin Integration"
                      v-model="enableJoplin"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <v-row v-if="enableJoplin">
                  <v-col>
                    <v-text-field
                      v-model="server"
                      required
                      label="Clip Server"
                      rules.server
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="token"
                      required
                      label="Token"
                      rules.token
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="notebook"
                      required
                      label="Snippet Notebook"
                      rules.notebook
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-divider />
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close()">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="save()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </focus-trap>
</template>
<script>

import {App} from "@/core/Constants";
import {platform, homedir} from 'os';
import Store from 'electron-store';

export default {
  name: 'Settings',
  data () {
    return {
      settingsTrap: false,
      enableJoplin: false,
      saveOnExit: true,
      notebook: 'Snippets',
      fileLocation: this.fileLocation,
      server: 'http://localhost:41184/notes?',
      rules: {
        token: [ val => val < 10 || `Need a valid token`],
        server: [val => val < 10 || `Normal localhost if the webcliper has been started`],
        notebook: [val => val < 10 || `Notebook containing your snippets`],
        fileLocation: [val => val < 10 || `A location is needed`],
      },
      settings: new Store(),
      token: ''
    }
  },
  mounted () {
    const isWin = platform() === 'win32';
    console.log('settings mounted: ' + isWin)
    this.fileLocation = isWin ? `${homedir()}\\${App.folderName}` : `${homedir()}/${App.folderName}`;

    this.settings = new Store({
      name: 'settings',
      schema: {
        storagePath: {
            default: 'string'
        },
        joplinEnabled: { 
          default: 'boolean',
        },
        token: {
          default: 'string',
        },
        server: {
          default: 'string'
        },
        notebook: { 
          default: 'string'
        }
      }
    })

    try {
      console.log('loading saved settings')
      this.storagePath = this.settings.get('storagePath')
      this.enableJoplin = this.settings.get('joplinEnabled')
      this.token = this.settings.get('token')
      this.server = this.settings.get('server')
      this.notebook = this.settings.get('notebook')
    } catch (error) {
      console.log('loading defaults settings')
      console.log(error)
    }

    this.$nextTick(function(){
      console.log('settingsTrap active')
      this.settingsTrap= true
    })
  },
  methods: {
    save () {
      this.settings.set('storagePath', this.fileLocation)
      this.settings.set('joplinEnabled', this.enableJoplin)
      this.settings.set('token', this.token)
      this.settings.set('server', this.server)
      this.settings.set('notebook', this.notebook)
      this.common()
    },
    close () {
      this.common()
    },
    common () {
      this.settingsTrap = false
      this.$root.$emit('settingsDialog',false)
    }
  }
}
</script>
