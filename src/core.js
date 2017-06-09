import window from './common/window';
import { document } from './common/document';

var initialized = null;

/**
 * Eleven
 * @constructor
 * @param  {Object} options Object containing Eleven's configuration
 * @return {Object}         Eleven instance
 */
const Eleven = (selector, options) => initialized || new Eleven.fn.init(selector, options);

Eleven.fn = Eleven.prototype = {
  constructor: Eleven,
  version: '1.0.0',
  init(selector, options){
    const defaultConfig = {
      autoRestart: true,
      debug: false,
      language: 'en-US',
      commands: [],
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      requiresWakeWord: true,
      speechAgent: 'Google UK English Female',
      useEngine: false,
      wakeCommands: ['eleven', '11'],
      wakeSound: 'https://s3-us-west-1.amazonaws.com/voicelabs/static/chime.mp3',
      wakeCommandWait: 10000,
      template: `
         <div class="eleven-container">
          <div class="eleven-container-inner">
            <div class="eleven-off">
              <span>ELEVEN</span>
            </div>
            <div class="eleven-on">
              <div class="bg"></div>
              <div class="waves"></div>
            </div>
          </div>
        </div>
      `
    };
    // create a ref to the container element
    this.container = document.querySelector(selector);
    // store options
    this.options = Eleven.extend({}, defaultConfig, options || {});
    // create markup
    this.container.innerHTML = this.options.template;
    // reference to all of our commands
    this.commands = {};
    // reference hash for installed plugins
    this.plugins = {};
    // create audio sound
    this.wakeSound = new Audio(this.options.wakeSound);
    // create interactive audio wave orb (aka Eleven)
    this.visualize();
    // prevent initialize until called
    if(!this.options.delayStart){
      // enable all the things!
      this.enable();
    }
    // print the instance config
    if(this.options.debug){
      Eleven.debug = true;
      console.debug(this);
    }
    
    if(Eleven.device.isDesktop){
      // configure speechSynthesis voices
      this.voices();
    }
    // allow single instance (Speech API does not support multiple instances yet)
    initialized = this;
    // always return this for chaining
    return this;
  }
};

Eleven.fn.init.prototype = Eleven.fn;

export default Eleven;
