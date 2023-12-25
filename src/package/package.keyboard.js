let executes = {};


class Execute {
    constructor() {
        this.keyName = "";
        this.upEvent = {"func": () => {}, "isImportant": false};
        this.downEvent = {"func": () => {}, "isImportant": false};
        this.isLoop = false;
    }

    /**
     * Set the key name.
     * @param {String} name - The key name.
     * @returns {Execute} - The current Execute instance.
     */
    setKeyName(name) {
        this.keyName = name;
        return this;
    }

    /**
     * Set whether the function is looping.
     * @param {Boolean} isLooping - Whether the function is looping.
     * @returns {Execute} - The current Execute instance.
     */
    setLoopingFunction(isLooping) {
        this.isLoop = isLooping;
        return this;
    }

    /**
     * 
     * @param {*} function_ 
     * @param {*} isImportant Est ce que quand un evenement au clavier est executer elle ira effacer cette evenement ou elle aura la prioriter
     * @returns 
     */
    setUpEvent(function_, isImportant) {
        this.upEvent.func = function_;
        this.upEvent.isImportant = isImportant;
        return this
    }

      /**
     * 
     * @param {*} function_ 
     * @param {*} isImportant Par exemple, lorsqu'on maintient la touche de droite pour déplacer le joueur vers la droite, puis que l'on change sa direction en utilisant la touche de gauche tout en maintenant la touche de droite enfoncée, et enfin que l'on relâche la touche de gauche. Est-ce que l'exécution de la touche de droite (pressée avant la touche de gauche mais maintenue enfoncée après le relâchement de la touche de gauche) va se poursuivre ou non ?
     * @returns 
     */
    setDownEvent(function_, isImportant) {
      this.downEvent.func = function_;
      this.downEvent.isImportant = isImportant;
      return this;
    }

    /**
     * WARNING: This is the last function to execute.
    */
    build() {
      Object.assign(executes, {...executes, ...{
        [this.keyName]: {
            "funcUp": this.upEvent,
            "funcDown": this.downEvent,
            "loop": this.isLoop,
            "isEnable": {"up": false, "down": false},
            "isTrigger": true
        }
    }});
    }
}


class Event {
  constructor(app) {
    // Ensure the PIXI application view is focusable
    app.view.tabIndex = 0;

    // Event handlers are now class methods for better organization
    app.view.addEventListener('keydown', this.handleKeyDown.bind(this));
    app.view.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.keyToExecute = [];
  }

  // Event handling methods
  handleKeyDown(event) {
    if (this.eventExists(event.key)) {
        if (executes[event.key].isTrigger) {
            executes[event.key].isTrigger = false
            this.handleKeyEvent(event, 'down');
        }
    }
  }

  handleKeyUp(event) {
    if (this.eventExists(event.key)) {
        if (!executes[event.key].isTrigger) {
            executes[event.key].isTrigger = true
            this.handleKeyEvent(event, 'up');
        }
    }
  }

  handleKeyEvent(event, type) {
    const key = event.key;
    if (this.eventExists(key)) {
      executes[key]["isEnable"]["down"] = type === "down";
      executes[key]["isEnable"]["up"] = type === "up";
      this.keyToExecute.push(key);
    }
  }

  // Public method to update events
  update() {
    // console.log(this.keyToExecute)
    const lastKeyEvent = this.keyToExecute[this.keyToExecute.length-1]
    if (lastKeyEvent) {
        const object = executes[lastKeyEvent]

        if (object.isEnable.up) {
          object.funcUp.func();
            if (!object.funcUp.isImportant) {
              this.keyToExecute = this.keyToExecute.splice(0, this.keyToExecute.length-1)
            } 
            if (!object.loop) {
              object.isEnable.up = false;
            }
        }

        if (object.isEnable.down) {
          object.funcDown.func();
          if (!object.funcDown.isImportant) {
            this.keyToExecute = this.keyToExecute.splice(0, this.keyToExecute.length-1)
          }
          if (!object.loop) {
            object.isEnable.down = false;
          }
        }
    }
  }

  // Helper method to check if an event exists
  eventExists(key) {
    return Object.keys(executes).includes(key);
  }
}

export { Execute, Event };