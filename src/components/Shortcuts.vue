<template>
  <div>
    <div>
      default focus - is set to the data table as soon as the application is open.  Use the 'j' and 'k' keys to move up and down the list.
    </div>
    <div>
      esc - shortcut['esc']
    </div>
  </div>
  
</template>
<script>

export default {
  name: 'Shortcuts',
  data () {
    return {
      shortcuts: [
        {'icon':'','title':'More', 'shortcut':'m', 'description':'show more clip data.  If the selection is an image dialog will appear, displaying more of the image'}, 
        {'icon':'','shortcut':'j', 'description':'moved the selected row one down'}, 
        {'icon':'','shortcut':'k', 'description':'move selection row one up'},
        {'icon':'','shortcut':'ctrl+l', 'description':'select the next page'}, 
        {'icon':'','shortcut':'ctrl+h', 'description': 'select the previous page'}, 
        {'icon':'','shortcut':'ctrl+n', 'description':'will change the layout focus'}, 
        {'icon':'','shortcut':'ctrl+k', 'description': 'will change the layout focus'}, 
        {'icon':'','shortcut':'alt+n', 'description': 'will open up the dialog for a new snip entry'}, 
        {'icon':'','shortcut':'e', 'description':'edit current selected clip'},
        {'icon':'','shortcut':'x','description':'delete currenct selected clip'}, 
        {'icon':'','shortcut':'x','description':'delete currenct selected clip'}, 
        {'icon':'','shortcut':'esc','description':'esc will close th eimage dialog and reset the default focus back to the data table'}, 
        {'icon':'','shortcut':'/','description':'will send the cursor to the data table search field'}, 
      ],
    }
    }
}
</script>