<template>
  <div>
  </div>
</template>
<script>
// import Settings from '@/components/Settings.vue'
// import VueCookies from 'vue-cookies'

export default {
  //getDiagram(diagramId) {
  //},
  getLiElements () {
    var lis = document.getElementsByTagName('li')
    return lis
  },
  mod (n, m) {
    return ((n % m) + m) % m
  },
  filteredKeys (hints, filter) {
    var hintsCopy = hints
    var key = []
    var keys = {}
    var i = 0
    var newHints = {}
    var filterData = {}
    for (key in hints) {
      if (Object.prototype.hasOwnProperty.call(hints, key) && filter.test(key)) {
        keys[key] = i
        newHints[key] = hintsCopy[key]
        i++
        continue
      }
      // hintsCopy[key].removeChild(hintsCopy[key].lastChild)
      if (this.debug) {
        // console.log(hintsCopy[key])
        // console.log(hintsCopy[key].parentElement)
        // console.log(hintsCopy[key].parentElement.lastChild)
        // console.log(hintsCopy[key].lastChild)
      }
      hintsCopy[key].parentElement.removeChild(hintsCopy[key].parentElement.lastChild)
    }
    hintsCopy = newHints
    filterData['keys'] = keys
    filterData['newHints'] = newHints

    return filterData
  },
  liSelectionK (selectList, liSelected) {
    var li = liSelected
    var selectLi = null
    if (li === null) {
      selectLi = selectList.length - 1
    } else {
      // this.prevLiSelected = this.mod(li, selectList.length)
      li = li - 1
      selectLi = this.mod(li, selectList.length)
    }
    return selectLi
  },
  liSelectionJ (selectList, liSelected) {
    var li = liSelected
    var selectLi = null
    if (li === null) {
      selectLi = 0
    } else {
      li = li + 1
      selectLi = this.mod(li, selectList.length)
    }
    return selectLi
  },
  debug () {
    // var debug = Settings.debug
    // debug = false
    // return debug
  },
  hintOptions () {
    // Need to get from database or a cookie
    // var hintOptions = VueCookies.get('hints')
    // return hintOptions
  },
  randomId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9)
  },
  settings () {
    var defaults = {'d3Line': 'curveBasis',
      'hintBGColor': '#36004c',
      'hintLinkColor': '#fff', 
      'debug': false, 
      'hints': 'asdfjklqweruiopzxcvnmgh', 
      'reset': false,
      'hintAction': 'Edit Object'
    }
    return defaults
  },
  // buildHints (elements, hyperLinks=false) {
  buildHints (elements) {
    var hints = {}
    var shortcutOptions = this.hintOptions()
    var shortcutLength = shortcutOptions.length
    var shortcut = ''
    var iterations = 0
    // var hintLinkColor = VueCookies.get('hintLinkColor')
    // var hintBGColor = VueCookies.get('hintBGColor')
    for (var i = 0, len = elements.length; i < len; i++) {
      shortcut = shortcutOptions.charAt(this.mod(i, shortcutLength))
      if (i > shortcut) {
        iterations = iterations + 1
        for (var iter = 0, iterLen = iterations; iter < iterLen; iter++) {
          shortcut = shortcut + shortcutOptions.charAt(this.mod(i, shortcutLength))
        }
      }
      if (this.debug) {
        // console.log(shortcut)
        // console.log(elements[i])
        // console.log(elements[i].type)
      }

      var div = document.createElement('div')
      div.setAttribute('tabindex', '-1')
      div.innerHTML = shortcut
      // if (elements[i].type === 'text') {
      //   div.style.cssText = 'display: table-caption; color: '+hintLinkColor+'; border: 1px solid #36004c; padding: 1px 8px 1px 8px; border-radius: 10px; background: '+hintBGColor+'; z-index: 1; position: absolute'
      //   elements[i].parentNode.append(div)
      // } else {
      //   div.style.cssText = 'display: table-caption; color: '+hintLinkColor+'; border: 1px solid #36004c; padding: 1px 8px 1px 8px; border-radius: 10px; background: '+hintBGColor+'; z-index: 1; position: absolute'
      //   /*Depending on what we are hinting on the parent is differnt*/
      //   if (hyperLinks) {
      //     elements[i].append(div)
      //   } else {
      //     //elements[i].parentElement.lastChild.append(div)
      //     elements[i].parentElement.append(div)
      //   }
      // }

      if (this.debug) {
        console.log(elements[i])
      }
      hints[shortcut] = elements[i]
    }

    return hints
  },
  selectionBool (index) {
    console.log(this.menuLinks[index].title)
    this.currentMenuLink = this.menuLinks[index].title
  },
  d3FilterKeys (hints, filter, eventKey) {
    // var key = []
    var keys = {}
    var newHints = {}
    var filterData = {}
    var hintKeys = this.hintsKeyReplaced + eventKey

    if (this.debug) {
      console.log(hints)
    }
    // Remove all href links that do not start with the key in the filter
    for (var key in hints) {
      if (this.debug) {
        //console.log(key)
        //console.log(String(key).indexOf(eventKey))
        // console.log(hints[key])
        // console.log(hints[key].parentElement)
        // console.log(hints.hasOwnProperty(key))
        // console.log(filter.test(key))
      }

      if (key === hintKeys) {
        newHints[key] = hints[hintKeys]
        // continue
      } else if (String(key).startsWith(hintKeys)) {
        var href = hints[key].parentElement.querySelector('a')
        this.hintsKeyReplaced = hintKeys
        href.text = href.text.replace(eventKey, '')
        newHints[key] = hints[key]
        // continue
      } else {
        hints[key].parentElement.lastElementChild.remove()
      }
    }
    filterData['keys'] = keys
    filterData['newHints'] = newHints

    return filterData
  },
  formHints (event, form){
    if (this.debug){
      console.log(event.key)
      console.log('form hints')
    }

    if (event.key == 'Escape') {
      console.log('escape')
      this.removeHints(form.hints)
      form.common()
    } else if ((Object.keys(form.hints).length > 0) && (Object.prototype.hasOwnProperty.call(form.hints, event.key))) {

      if (this.debug) {
        //console.log(form.hints[event.key])
      }

      // Removes the hint
      this.removeHint(form.hints, event.key)
      //form.hints[event.key].parentElement.removeChild(form.hints[event.key].parentElement.lastChild)
      //delete Object.prototype.hasOwnProperty.call(form.hints, event.key)

      if (form.hints[event.key].type === 'text') {
        form.hints[event.key].focus()
        // this.hints[event.key].click()
      } else {
        form.hints[event.key].click()
      }
      // this.hints[event.key].previousSibling.click()
      if (Object.keys(form.hints).length === 1) {
        form.hints = {}
      }
    } else if (event.key == "f" ){
      if (Object.keys(form.hints).length > 0) {
        console.log('hints already being displayed')
        this.removeHint(form.hints, event.key)
      } else {
        var inputs = form.$refs.formfields.$el.querySelectorAll('submit,input,textarea')
        return form.hints = this.buildHints(inputs)
        // this.addFollowLinks()
      }
      //  break
      // case 'Cancel':
      //   console.log('cancel')
      //   this.$root.$emit('nodeModal', 'node')
      //   break
      // default:
      //   console.log('default')
    } 
    // This delete helps cleanup the remaining hints, without removing the form radio
    // object
    delete form.hints[event.key]
    return form.hints
  },
  removeHint (hints, eventKey) {
    hints[eventKey].parentElement.removeChild(hints[eventKey].parentElement.lastChild)
  },
  removeHints (hints) {
    try {
      if (this.debug) {
        console.log(hints)
      }
      var newHints = {}
      for (var key in hints) {
        console.log(key)
        console.log(hints[key].parentElement)
        console.log(hints[key].parentElement.lastElementChild)
        // hints[key].parentElement.removeChild(hints[key].parentElement.lastChild)
        // hints[key].parentElement.removeChild(hints[key].parentElement.lastChild)
        //Only remove if hint is active
        hints[key].parentElement.lastElementChild.remove()
        // hints[key].parentElement.removeChild(hints[key].parentElement.lastElementChild)
        //hints[key].removeChild(hints[key].parentElement.lastChild)
      }
    } catch (error) {
      console.log(error)
    }
    return newHints
  },
  /**
   * Return an id from a list of items based on j or k events
   * eg: list of li items an event of key j will return the first li
   * @param {integer} index being tracked
   * @param {integer} j or k event keys
   * @param {integer} max number of items
   * @return {integer} a number
   **/
  getIndex(index, key, items){
    var id = null
    if (index === null || isNaN(index)) {
      id = 0
    } else {
      switch(key){
        case 'j':
          id = this.add(index)
          break
        case 'k':
          id= this.remove(index)
      }
        id = this.mod(id, items)
    }

    return id
  },
  /**
   * 
   */
  getPage(index, key, pages){
    var id = null
    switch(key){
      case 'l':
        id = this.add(index)
        break
      case 'h':
        id = this.remove(index)
        break
    }
    id = this.mod(id, pages + 1)
    if (id == 0) {
      id = 1
    }
    return id
  },
  add(item){
    return item + 1
  },
  remove(item){
    return item - 1
  },
  saveLocal(data){
    localStorage.setItem('samus.lastUpdated', JSON.stringify(data))
  },
  getLocal(){
    var localData = JSON.parse(localStorage.getItem('samus.lastUpdated'))
    return localData
  },
  auth(){
    if (localStorage.getItem('token')){
      return true
    } else {
      return false
    }
  },
  updateId(id){
    var localData = this.getLocal()
    console.log(localData)
    localData.id = id

    this.saveLocal(localData)
  },
  defaultNodeValues() {
    var data = {
      nodeLabel: 'default Node Label',
      nodeShape: 'rect',
      nodeLabelType: 'text'
    }
    return data
  },
  defaultEdgeValues() {
    var data = {
      edgeLabel: 'default Edge Label',
      edgeLabelType: 'text',
      edgeArrowHeadStyle: 'solid',
      edgeArrowHead: 'undirected',
      //d3.curveBasis: 'text'
    }
    return data
  }
}
</script>