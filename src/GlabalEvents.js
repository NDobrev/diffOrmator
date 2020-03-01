
class GlabalEventHandler
{
    constructor() {
        this.events = {};
    }
  RigsterForEvent(name, handler) {
    if(!this.events[name]) {
        let defaultHandler = (value) => console.log(value);
        this.events[name] = [defaultHandler];
    }
    this.events[name].push(handler);
  }

  FireEvent(name, value) {
    if (this.events[name]) {
        for(let h of this.events[name]) {
            h(value);
        }
    }
  }
}

export const NAVIGATE_TO = "NavigateTo";
export const ADD_CHANGE = "AddChange";
export const REMOVE_CHANGE = "RemoveChange";

export default GlabalEventHandler