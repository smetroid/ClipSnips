<template>
<v-container fluid>
  <v-row justify="center" >
    <v-col class="ma-0 pa-0">
      <focus-trap 
        v-model="formDialog" 
        >
        <v-card 
          class="scroll_enabled"
          min-height="300px">
          <v-card-title>
            <span v-if="update" class="text-h5">Update ClipSnip</span>
            <span v-else class="text-h5">New ClipSnip</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Title*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="[
                      'Work',
                      'Personal',
                      'DevOps',
                      'Linux',
                      'Databases',
                      'Influx',
                      'Important',
                      'Secrets',
                      'Git',
                    ]"
                    label="Tags"
                    multiple
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-textarea
                    name="Command"
                    label="Command"
                    hint="example of helper text only on focus"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-textarea
                    name="Description"
                    label="Description"
                    hint="example of helper text only on focus"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    label="Favorite"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close()">
              Close
            </v-btn>
            <v-btn 
              v-if="update"
              color="blue darken-1" 
              text @click="updateClip()"
              >
              Update
            </v-btn>
            <v-btn v-else color="blue darken-1" text @click="save()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </focus-trap>
    </v-col>
  </v-row>
</v-container>
</template>
<script>
import { DBApi } from '@/core/Api.js'
const db = new DBApi()
export default {
  name: 'ClipForm',
  props: ['id'],
  data() {
    return {
      update: false,
      title: 'New ClipSnip Default Title',
      description: 'New ClipSnip Default Description',
      tags: null,
      isFavorite: false,
      isTrash: false,
      date:  Date.now(),
      clip: 'Clip Snippet '
    }
  },
  methods: {
    mounted () {
      var snipClip = db.getCommand(this.id)
      this.title = snipClip.title
      this.description = snipClip.description
      this.isFavorite = snipClip.isFavorite
      this.isTrash = snipClip.isTrash
      this.date = snipClip.date
      this.snip = snipClip.snip
    },
    create () {

    },
    updateClip () {

    },
    close () {
      this.update = false
    }
  }
}
</script>
<style scoped>
</style>
