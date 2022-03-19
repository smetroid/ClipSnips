<template>
  <v-container class="scroll_enabled">
      <v-row>
        <div>
          <h1>Usage</h1>
          <p> * <b>default trap focus</b> is set to the data table as soon as the application is open.  Use the <b>j</b> and <b>k</b> keys to move up and down the list. </p>
          <p> * <b>ctrl+m</b> to open up the navigation menu.  Use the <b>j</b> and <b>k</b> keys to move up and down the list  <br />
          You can use <b>ctrl+m</b> or <b>esc</b> key to close the navigation.
          </p>
          <p> * <b>focus trap</b> is the vuetify component that is trapped and allows you to use the 'j' and 'k' shortcuts to change the selections. <br />
          You can also use the <b>tab</b> key to circle through the fields. </p>
          <p> * <b>focus trap components</b> the following are vuetify components that can be trapped: <br />
          1. Data table<br />
          2. Navigation<br />
          2. Dialogs
          </p>
        </div>
      </v-row>
      <v-divider>
      </v-divider>
      <v-row dense>
        <v-col class="d-flex justify-center">
          <h1>Shortcut</h1>
        </v-col>
        <v-col class="d-flex justify-center">
          <h1>Description</h1>
        </v-col>
      </v-row>
      <v-row 
        dense
        v-for="(s, i) in shortcuts"
          :key="i"
        >
          <v-col class="d-flex justify-center" align-self="center">
            {{ s.shortcut}}
          </v-col>
          <v-col>
            {{ s.description}}
          </v-col>
      </v-row>
  </v-container>
</template>
<script>

export default {
  name: 'Shortcuts',
  data () {
    return {
      shortcutDialog: false,
      shortcuts: [
        {'icon':'','shortcut':'m', 'description':'Show more clip data.  If the selection is an image dialog will appear, displaying a bigger image'}, 
        {'icon':'','shortcut':'j', 'description':'Moved the selected row one down'}, 
        {'icon':'','shortcut':'k', 'description':'Move selection row one up'},
        {'icon':'','shortcut':'l', 'description':'Select the next page'}, 
        {'icon':'','shortcut':'h', 'description': 'Select the previous page'}, 
        {'icon':'','shortcut':'alt+n', 'description': 'Will open up the dialog for a new ClipSnip entry'}, 
        {'icon':'','shortcut':'e', 'description':'edit current selected clip'},
        {'icon':'','shortcut':'x','description':'delete currenct selected clip'}, 
        {'icon':'','shortcut':'esc','description':'esc will close the image dialog and reset the default focus back to the data table'}, 
        {'icon':'','shortcut':'/','description':'will send the cursor to the data table search field'}, 
      ],
    }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll_enabled {
    overflow: scroll;
    height: 600px; /* define your custom height */
}
.scroll_enabled::-webkit-scrollbar {
    width: 15px;
}
.scroll_enabled::-webkit-scrollbar-corner {
    background: rgba(0,0,0,0);
}
.scroll_enabled::-webkit-scrollbar-thumb {
    background-color: #e6e6e6;
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