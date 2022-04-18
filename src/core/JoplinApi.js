import axios from 'axios'
import Store from 'electron-store';
axios.defaults.baseURL = ''
// axios.defaults.headers.common['Authorization'] = token
var settings = new Store({
  name: 'settings',
})

console.log('loading saved settings')
var token = settings.get('token')
console.log(token)
// var notebook = settings.get('notebook')
axios.defaults.baseURL = settings.get('server')
//axios.defaults.params.token = token
axios.interceptors.request.use((config) => {
  config.params = config.params || {}
  config.params.token = token
  return config
})

export default {
  name: 'JoplinApi',
  propts: ['joplinSettings'],
  async getAllSnippetNotes () {
    var snippetTagId = await this.getSnippetTagId()
    return axios.get('/tags/'+snippetTagId+'/notes?&fields=id,title,body,updated_time,', {
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        return error
      })
      .finally(() => {
        console.log('getAllNotes finish')
      })
  },
  async getAllTags () {
    return axios.get('/tags?', { 
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        return error
      })
      .finally(() => {
        console.log('building diagram finished')
      })
  },
  async getSnippetTagId () {
    return axios.get('/search?query=snippet&type=tag&fields=id',{
      })
      .then(response => {
        console.log(response.data)
        return response.data.items[0].id
      })
      .catch(error => {
        return error
      })
  },
  // async updateDiagram (data, app) {
  //   if (D3Util.debug) {
  //     console.log(data.diagramId)
  //     console.log(data.diagram)
  //   }
  //   /* eslint-disable-next-line  */
  //   //var json = new dagreD3.graphlib.json.write(data.graph)

  //   var updated = new Date()
  //   var updatedData = {'id': data.diagramId, 'name': data.name, 'description': data.description, 'diagram': data.diagram, 'updatedTime': updated.toISOString()}

  //   return axios.post('/dag/' + data.diagramId + '/update', updatedData,
  //     { headers: { Authorization: 'Bearer ' + localStorage.getItem('token')
  //       }
  //     })
  //     .then(response => {
  //       if (D3Util.debug) {
  //         console.log(response)
  //       }

  //       if (Object.prototype.hasOwnProperty.call(response, 'data')) {
  //         app.$root.$emit('appMessage', true, 'Diagram saved', JSON.stringify(response.data))
  //       } else {
  //         app.$root.$emit('appMessage', false, 'Failed to save diagram', JSON.stringify(response.data))
  //       }
  //       app.$root.$emit("changeActive")


  //       return response
  //     })
  //     .catch(error => {
  //       return error
  //     })
  // },
  // async deleteDiagram (id) {
  //   if (D3Util.debug) {
  //     console.log(id)
  //   }
  //   return axios.delete('/dag/' + id,
  //     { headers:
  //       { Authorization: 'Bearer ' + localStorage.getItem('token')
  //       }
  //     })
  //     .then(response => {
  //       return response.data
  //     })
  // },
  // addNode (id, update = false, g, nodes) {
  //   if (update) {
  //     g.setNode(nodes[0], { 'label': inputs[0].value, 'shape': selections[0].value, 'labelType': selections[1].value })
  //   } else {
  //     g.setNode(this.randomId(), { 'label': inputs[0].value, 'shape': selections[0].value, 'labelType': selections[1].value })
  //   }
  // }
}
