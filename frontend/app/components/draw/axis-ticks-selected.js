import Ember from 'ember';

import AxisEvents from '../../utils/draw/axis-events';

export default Ember.Component.extend(AxisEvents, {

  
  resized : function(widthChanged, heightChanged, useTransition) {
    /* useTransition could be passed down to showTickLocations()
     * (also could pass in duration or t from showResize()).
     */
    console.log("resized in components/axis-1d");
    if (heightChanged)
      this.renderTicksThrottle();
  },

  /** axis-ticks-selected receives axisStackChanged and zoomedAxis from axis-1d,
   * which filters zoomedAxis events for by axisID.  axisStackChanged events are
   * not specific to an axisID.
   */


  axisStackChanged : function() {
    console.log("axisStackChanged in components/axis-1d");
    /* draw-map : axisStackChanged() / axisStackChanged_() already does throttle. */
    this.renderTicks();
  },

  /** @param [axisID, t] */
  zoomedAxis : function(axisID_t) {
    let axisID = axisID_t && axisID_t[0],
    axisName = this.get('axis.id');
    console.log('zoomedAxis', axisID_t, axisID, axisName);
    this.renderTicksThrottle(axisID_t);
  },

  didRender() {
    let featuresInBlocks = this.get('featuresInBlocks');
    console.log('didRender', featuresInBlocks, this.get('axisId'),
                'axis1d ', this.get('axis1d'));
    this.renderTicksThrottle();
  },

  renderTicks(axisID_t) {
    console.log("renderTicks in components/axis-1d", axisID_t);
    this.get('axis1d.featureTicks').showTickLocations(
      this.featuresOfBlockLookup.bind(this),
      true,  /* undefined or false after text featureExtra is added */
      'foundFeatures', false
    );
  },
  /** call renderTicks().
   * filter / throttle the calls to handle multiple events at the same time.
   * @param axisID_t is defined by zoomedAxis(), undefined when called from
   * axisStackChanged()
   */
  renderTicksThrottle(axisID_t) {
    console.log('renderTicksThrottle', axisID_t);

    /* see comments in axis-1d.js : renderTicksThrottle() re. throttle versus debounce */    
    Ember.run.throttle(this, this.renderTicks, axisID_t, 500);
  },

  /** Lookup the given block in featuresInBlocks, and return its features which
   * were in the featureSearch result.
   * @param block Stacks Block
   */
  featuresOfBlockLookup(block) {
    /** features found by goto-feature-list, indexed by block id. */
    let featuresInBlocks = this.get('featuresInBlocks');
    let blockId = block.get('id');
    /** return [] for blocks which don't have features in the search result. */
    let features = featuresInBlocks ? (featuresInBlocks[blockId] || []) : [];
    console.log('featuresOfBlockLookup', featuresInBlocks, block, blockId, features);
    return features;
  }
  
});

