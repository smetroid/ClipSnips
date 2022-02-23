<template>
  <v-row justify="center">
      <focus-trap v-model="formDialog">
        <v-dialog v-model="formDialog">
          <v-card>
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
        </v-dialog>
      </focus-trap>
  </v-row>
</template>
<script>
export default {
  name: 'ClipForm',
  props: ['clipId'],
  data() {
    return {
      formDialog: false,
      update: false
    }
  },
  methods: {
    create () {

    },
    updateClip () {

    },
    close () {
      this.update = false
      this.formDialog = false
    }
  }
}
</script>
