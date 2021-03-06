// @ts-nocheck

/**
EventSource implementation for React Native, based on "react-native-eventsource" library (https://www.npmjs.com/package/react-native-eventsource).

See @license https://github.com/neilco/EventSource/blob/master/LICENSE.txt for additional license details.

See @license https://github.com/kaazing/java.client/blob/master/LICENSE.txt for additional license details.

Copyright (c) 2015 João Ribeiro (http://github.com/JonnyBGod/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

var { NativeModules, DeviceEventEmitter } = require('react-native');

var RNEventSource = NativeModules.RNEventSource;

var EventSourceBase = require('./EventSourceBase');
var EventSourceEvent = require('./EventSourceEvent');

var EventSourceId = 0;
// var CLOSE_NORMAL = 1000;

/**
 * Browser-compatible EventSources implementation.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
class EventSource extends EventSourceBase {
  // _sourceId: number;
  // _subs: any;

  connectToSourceImpl(url) {
    this._sourceId = EventSourceId++;

    RNEventSource.connect(url, this._sourceId);

    this._registerEvents(this._sourceId);
  }

  closeConnectionImpl() {
    this._closeEventSource(this._sourceId);
  }

  cancelConnectionImpl() {
    this._closeEventSource(this._sourceId);
  }

  _closeEventSource(id) {
    this.readyState = this.CLOSED;
    RNEventSource.close(id);
  }

  _unregisterEvents() {
    this._subs.forEach((e) => e.remove());
    this._subs = [];
  }

  _registerEvents(id) {
    this._subs = [
      DeviceEventEmitter.addListener('eventsourceEvent', (ev) => {
        if (ev.id !== id) {
          return;
        }
        var event = new EventSourceEvent(ev.type, {
          data: ev.message || ev.data,
        });
        if (ev.type === 'message' && this.onmessage) this.onmessage(event);
        this.dispatchEvent(event);
      }),
      DeviceEventEmitter.addListener('eventsourceOpen', (ev) => {
        if (ev.id !== id) {
          return;
        }
        this.readyState = this.OPEN;
        var event = new EventSourceEvent('open');
        this.onopen && this.onopen(event);
        this.dispatchEvent(event);
      }),
      DeviceEventEmitter.addListener('eventsourceFailed', (ev) => {
        // Don't handle error event if it corresponds to another connection instance or the instance has been closed.
        // Last condition is necessary for Android implementation of EventSource, which emits an error when closing the connection explicitly.
        if (ev.id !== id || this.readyState === this.CLOSED) {
          return;
        }
        var event = new EventSourceEvent('error');
        event.message = ev.message;
        this.onerror && this.onerror(event);
        this.dispatchEvent(event);
        this._unregisterEvents();
        this.close();
      }),
    ];
  }
}

module.exports = EventSource;
