// const EventDebugType = 'Event Publish-subscribe';
class Event {
  constructor() {
    this._listeners = {};
  }

  /**
   * add evt listener queue
   * @param evt
   * @param fn
   * @returns {number}
   */
  $on(evt, fn) {
    if (!this._listeners[evt]) {
      this._listeners[evt] = [];
    }
    const len = this._listeners[evt].push(fn);
    return len - 1;
  }

  /**
   * off one evt
   * @param evt
   * @param fn
   */
  $off(evt, fn) {
    this._listeners[evt] = this._listeners[evt].filter(func => func !== fn);
  }

  /**
   * clear  evt
   * @param evt
   */
  $clear(evt) {
    delete this._listeners[evt];
  }

  /**
   * destroy all
   */

  $destroy() {
    this._listeners = {};
  }

  /**
   * emit all listener
   * @param evt
   * @param data
   */
  // @debug(`${EventDebugType}:Pub`, '$emit(publish) event ')
  $emit(evt, data) {
    this._listeners[evt].forEach(fn => fn(data));
  }
}

export default new Event();
