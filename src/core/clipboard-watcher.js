import {clipboard} from 'electron';
import EventEmitter from 'events';
// import crypto from 'crypto';
import { uuid } from 'vue-uuid'
// import { DBApi } from '@/core/Api.js';
// const db = new DBApi()

// function getHash(data) {
//   return crypto.createHash('sha256')
//     .update(data)
//     .digest('hex');
// }

function generateThumb(nativeImageData) {
  const aspectRatio = nativeImageData.getAspectRatio();

  const resizeOptions = {
    width: 300,
    height: 300
  };

  if (aspectRatio > 1) {
    // Landscape image
    resizeOptions.width /= aspectRatio;
  } else {
    // Portrait image
    resizeOptions.height /= aspectRatio;
  }

  const thumb = nativeImageData.resize(resizeOptions);
  return {
    thumbWidth: resizeOptions.width,
    thumbHeight: resizeOptions.height,
    thumbBuffer: thumb.toDataURL()
  };
}

function getImageItem(nativeImageData) {
  return {
    type: 'image',
    ...nativeImageData.getSize(),
    buffer: nativeImageData.toBitmap()
  };
}

function areItemsEqual(oldItem, newItem) {
  if (oldItem && newItem) {
    if (oldItem.type === newItem.type) {
      if (oldItem.type === 'image') {
        return (oldItem.buffer.equals(newItem.buffer));
      }

      if (oldItem.type === 'text') {
        return (
          oldItem.text === newItem.text &&
          oldItem.html === newItem.html &&
          oldItem.rtf === newItem.rtf
        );
      }
    }
  }

  return false;
}

export class ClipboardWatcher extends EventEmitter {
  constructor() {
    super();

    this._isListening = false;
    this._recentClipItem = null;
    this._parent = null;

    this._watchLoop = this._watchLoop.bind(this);
  }

  startListening(vueApp) {
    this._isListening = true;
    this._parent = vueApp
    this._watchLoop();
  }

  _watchLoop() {
    if (!this._isListening) {
      return;
    }

    this._scrapeClipboard();

    setTimeout(this._watchLoop, 1000);
  }

  _scrapeClipboard() {
    const availableFormats = clipboard.availableFormats();

    if (availableFormats.length === 0) {
      return;
    }

    let newClipItem = {};
    let clipboardImage = null;

    if (availableFormats.find(pattern => pattern.startsWith('image/'))) {
      clipboardImage = clipboard.readImage();
      newClipItem = getImageItem(clipboardImage);
    } else if (availableFormats.find(pattern => pattern.startsWith('text/'))) {
      newClipItem = {
        type: 'text',
        text: clipboard.readText(),
        html: clipboard.readHTML(),
        rtf: clipboard.readRTF()
      };

      if (!newClipItem.text.trim()) {
        return;
      }
    }

    if (areItemsEqual(this._recentClipItem, newClipItem)) {
      console.log('items are equal')
      return;
    }
    console.log('items NOT equal')

    newClipItem.timestamp = Date.now();
    this._recentClipItem = newClipItem;

    var entry = { 
      id: uuid.v4(), 
      title: null, 
      description: null,
      tags: null,
      isFavorite: false,
      isTrash: false,
      date: new Date().toLocaleString() 
    }

    if (newClipItem.type === 'image') {
      const thumb = generateThumb(clipboardImage);
      Object.assign(newClipItem, thumb);
      entry.clip = {
        ...newClipItem,
        buffer: clipboardImage.toDataURL()
      }
      //db.addNewCommandItem(entry)
      this._parent.$root.$emit('addItem', entry)
    } else {
      entry.clip = newClipItem
      //db.addNewCommandItem(entry)
      console.log(this)
      //this.emit('item', newClipItem)
      this._parent.$root.$emit('addItem', entry)
    }
  }
}