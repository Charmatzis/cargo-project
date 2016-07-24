'use strict';

/* global L */

// A layer control which provides for layer groupings.
// Author: Ishmael Smyrnow
L.Control.GroupedLayers = L.Control.extend({

  options: {
    collapsed: true,
    position: 'topright',
    autoZIndex: true,
    exclusiveGroups: [],
    groupCheckboxes: false,
    saturate: 1,
    lighten: 1,
    hueShift: 0,
    opacity: 1
  },

  initialize: function initialize(baseLayers, groupedOverlays, options) {
    var i, j;
    L.Util.setOptions(this, options);

    this._layers = {};
    this._lastZIndex = 0;
    this._handlingClick = false;
    this._groupList = [];
    this._domGroups = [];

    for (i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (i in groupedOverlays) {
      for (var j in groupedOverlays[i]) {
        this._addLayer(groupedOverlays[i][j], j, i, true);
      }
    }
  },

  onAdd: function onAdd(map) {
    this._initLayout();
    this._update();

    map.on('layeradd', this._onLayerChange, this).on('layerremove', this._onLayerChange, this);

    return this._container;
  },

  onRemove: function onRemove(map) {
    map.off('layeradd', this._onLayerChange);
  },

  addBaseLayer: function addBaseLayer(layer, name) {
    this._addLayer(layer, name);
    this._update();
    return this;
  },

  addOverlay: function addOverlay(layer, name, group) {
    this._addLayer(layer, name, group, true, true);
    this._update();
    return this;
  },

  removeLayer: function removeLayer(layer) {
    var id = L.Util.stamp(layer);
    delete this._layers[id];
    this._update();
    return this;
  },

  _initLayout: function _initLayout() {
    var className = 'leaflet-control-layers',
        container = this._container = L.DomUtil.create('div', className);

    //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    if (!L.Browser.touch) {
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    }

    var form = this._form = L.DomUtil.create('form', className + '-list');

    if (this.options.collapsed) {
      if (!L.Browser.android) {
        L.DomEvent.on(container, 'mouseover', this._expand, this).on(container, 'mouseout', this._collapse, this);
      }
      var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
      link.href = '#';
      link.title = 'Layers';

      if (L.Browser.touch) {
        L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', this._expand, this);
      } else {
        L.DomEvent.on(link, 'focus', this._expand, this);
      }

      this._map.on('click', this._collapse, this);
      // TODO keyboard accessibility
    } else {
        this._expand();
      }

    this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
    this._separator = L.DomUtil.create('div', className + '-separator', form);
    this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

    container.appendChild(form);
  },

  _addLayer: function _addLayer(layer, name, group, overlay, removable) {
    var id = L.Util.stamp(layer);

    this._layers[id] = {
      layer: layer,
      name: name,
      overlay: overlay,
      removable: removable
    };

    group = group || '';
    var groupId = this._indexOf(this._groupList, group);

    if (groupId === -1) {
      groupId = this._groupList.push(group) - 1;
    }

    var exclusive = this._indexOf(this.options.exclusiveGroups, group) != -1;

    this._layers[id].group = {
      name: group,
      id: groupId,
      exclusive: exclusive
    };

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }
  },

  _update: function _update() {
    if (!this._container) {
      return;
    }

    this._baseLayersList.innerHTML = '';
    this._overlaysList.innerHTML = '';
    this._domGroups.length = 0;

    var baseLayersPresent = false,
        overlaysPresent = false,
        i,
        obj;

    for (i in this._layers) {
      obj = this._layers[i];
      this._addItem(obj);
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
  },

  _onLayerChange: function _onLayerChange(e) {
    var obj = this._map._layers[L.Util.stamp(e.layer)];

    if (!obj) {
      return;
    }

    if (!this._handlingClick) {
      this._update();
    }

    var type = obj.overlay ? e.type === 'layeradd' ? 'overlayadd' : 'overlayremove' : e.type === 'layeradd' ? 'baselayerchange' : null;

    if (type) {
      if (type === 'overlayremove') {
        this._map.fire(type, obj);
      }
    }
  },

  // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
  _createRadioElement: function _createRadioElement(name, checked) {

    var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
    if (checked) {
      radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';

    var radioFragment = document.createElement('div');
    radioFragment.innerHTML = radioHtml;

    return radioFragment.firstChild;
  },

  updateOverlayImage: function updateOverlayImage() {
    jQuery(".leaflet-image-layer").css({ "-webkit-filter": "opacity(" + this.options.opacity + ")" + "saturate(" + this.options.saturate + ")" + " brightness(" + this.options.lighten + ")" + "hue-rotate(" + this.options.hueShift + "deg)" });
  },

  changeOpacity: function changeOpacity(e) {
    console.log("previous value: " + this.options.opacity + "next value: " + e.target.value);
    this.options.opacity = e.target.value;
    this.updateOverlayImage();
  },

  changeSaturate: function changeSaturate(e) {
    this.options.saturate = e.target.value;
    this.updateOverlayImage();
  },

  changeLighten: function changeLighten(e) {
    this.options.lighten = e.target.value;
    this.updateOverlayImage();
  },

  changeHueShift: function changeHueShift(e) {
    this.options.hueShift = e.target.value;
    this.updateOverlayImage();
  },

  _addItem: function _addItem(obj) {
    var label = document.createElement('label'),
        input,
        checked = this._map.hasLayer(obj.layer),
        container;

    if (obj.overlay) {
      if (obj.group.exclusive) {
        groupRadioName = 'leaflet-exclusive-group-layer-' + obj.group.id;
        input = this._createRadioElement(groupRadioName, checked);
      } else {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.defaultChecked = checked;
      }
    } else {
      input = this._createRadioElement('leaflet-base-layers', checked);
    }

    input.layerId = L.Util.stamp(obj.layer);
    input.groupID = obj.group.id;
    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    label.appendChild(input);
    label.appendChild(name);

    //add remove layer

    // configure the delete button for layers with attribute removable = true
    if (obj.removable) {
      var bt_delete = document.createElement("input");
      bt_delete.type = "button";
      bt_delete.className = "bt_delete";
      L.DomEvent.on(bt_delete, 'click', this._onDeleteClick, this);
      label.appendChild(bt_delete);
      //this._map.addLayer(obj.layer);
    }

    // configure the visible attribute to layer
    //if (obj.layer.StyledLayerControl.visible) {

    //}

    if (obj.overlay) {
      var div_slider = document.createElement("div");
      div_slider.className = "background-sliders";
      div_slider.setAttribute("data-role", "listview");

      //opacity
      var opacity_div = document.createElement('div');

      var opacity_label = document.createElement('label');
      opacity_label.innerHTML = "Opacity";
      opacity_label.for = "rangeSlider_opacity";

      var opacity_slider = document.createElement("input");
      opacity_slider.type = "range";
      opacity_slider.value = 1;
      opacity_slider.min = 0;
      opacity_slider.max = 1;
      opacity_slider.step = 0.001;
      opacity_slider.id = "rangeSlider_opacity";
      L.DomEvent.on(opacity_slider, 'change', this.changeOpacity, this);

      opacity_div.appendChild(opacity_label);
      opacity_div.appendChild(opacity_slider);

      //hue
      var hue_div = document.createElement('div');

      var hue_label = document.createElement('label');
      hue_label.innerHTML = "Hue";
      hue_label.for = "rangeSlider_hue";

      var hue_slider = document.createElement("input");
      hue_slider.type = "range";
      hue_slider.value = 0;
      hue_slider.min = -180;
      hue_slider.max = 180;
      hue_slider.step = 5;
      hue_slider.id = "rangeSlider_hue";
      L.DomEvent.on(hue_slider, 'change', this.changeHueShift, this);

      hue_div.appendChild(hue_label);
      hue_div.appendChild(hue_slider);

      //saturation
      var saturation_div = document.createElement('div');

      var saturation_label = document.createElement('label');
      saturation_label.innerHTML = "Saturation";
      saturation_label.for = "rangeSlider_saturation";

      var saturation_slider = document.createElement("input");
      saturation_slider.type = "range";
      saturation_slider.value = 1;
      saturation_slider.min = 0;
      saturation_slider.max = 2;
      saturation_slider.step = 0.005;
      saturation_slider.id = "rangeSlider_saturation";
      L.DomEvent.on(saturation_slider, 'change', this.changeSaturate, this);

      saturation_div.appendChild(saturation_label);
      saturation_div.appendChild(saturation_slider);

      //brightness_
      var brightness_div = document.createElement('div');

      var brightness_label = document.createElement('label');
      brightness_label.innerHTML = "Brightness";
      brightness_label.for = "rangeSlider_brightness";

      var brightness_slider = document.createElement("input");
      brightness_slider.type = "range";
      brightness_slider.value = 1;
      brightness_slider.min = 0;
      brightness_slider.max = 2;
      brightness_slider.step = 0.005;
      brightness_slider.id = "rangeSlider_brightness";
      L.DomEvent.on(brightness_slider, 'change', this.changeLighten, this);

      brightness_div.appendChild(brightness_label);
      brightness_div.appendChild(brightness_slider);

      //add all compoments
      div_slider.appendChild(opacity_div);
      div_slider.appendChild(hue_div);
      div_slider.appendChild(saturation_div);
      div_slider.appendChild(brightness_div);

      label.appendChild(div_slider);

      container = this._overlaysList;

      var groupContainer = this._domGroups[obj.group.id];

      // Create the group container if it doesn't exist
      if (!groupContainer) {
        groupContainer = document.createElement('div');
        groupContainer.className = 'leaflet-control-layers-group';
        groupContainer.id = 'leaflet-control-layers-group-' + obj.group.id;

        var groupLabel = document.createElement('label');
        groupLabel.className = 'leaflet-control-layers-group-label';

        if ("" != obj.group.name && !obj.group.exclusive) {
          // ------ add a group checkbox with an _onInputClickGroup function
          if (this.options.groupCheckboxes) {
            var groupInput = document.createElement('input');
            groupInput.type = 'checkbox';
            groupInput.className = 'leaflet-control-layers-group-selector';
            groupInput.groupID = obj.group.id;
            groupInput.legend = this;
            L.DomEvent.on(groupInput, 'click', this._onGroupInputClick, groupInput);
            groupLabel.appendChild(groupInput);
          };
        };

        var groupName = document.createElement('span');
        groupName.className = 'leaflet-control-layers-group-name';
        groupName.innerHTML = obj.group.name;
        groupLabel.appendChild(groupName);

        groupContainer.appendChild(groupLabel);
        container.appendChild(groupContainer);

        this._domGroups[obj.group.id] = groupContainer;
      }

      container = groupContainer;
    } else {
      container = this._baseLayersList;
    }

    container.appendChild(label);

    return label;
  },

  _onGroupInputClick: function _onGroupInputClick() {
    var i, input, obj;

    this_legend = this.legend;
    this_legend._handlingClick = true;

    var inputs = this_legend._form.getElementsByTagName('input');
    var inputsLen = inputs.length;
    for (i = 0; i < inputsLen; i++) {
      input = inputs[i];
      if (input.groupID == this.groupID && input.className == 'leaflet-control-layers-selector') {
        input.checked = this.checked;
        obj = this_legend._layers[input.layerId];
        if (input.checked && !this_legend._map.hasLayer(obj.layer)) {
          this_legend._map.addLayer(obj.layer);
        } else if (!input.checked && this_legend._map.hasLayer(obj.layer)) {
          this_legend._map.removeLayer(obj.layer);
        };
      };
    };
    this_legend._handlingClick = false;
  },

  _onInputClick: function _onInputClick() {
    var i,
        input,
        obj,
        inputs = this._form.getElementsByTagName('input'),
        inputsLen = inputs.length;

    this._handlingClick = true;

    for (i = 0; i < inputsLen; i++) {
      input = inputs[i];
      if (input.className == 'leaflet-control-layers-selector') {
        obj = this._layers[input.layerId];

        if (input.checked && !this._map.hasLayer(obj.layer)) {
          this._map.addLayer(obj.layer);
        } else if (!input.checked && this._map.hasLayer(obj.layer)) {
          this._map.removeLayer(obj.layer);
        }
      }
    }

    this._handlingClick = false;
  },

  _onDeleteClick: function _onDeleteClick(obj) {

    var node = obj.target.parentElement.childNodes[0];
    var n_obj = this._layers[node.layerId];

    // verify if obj is a basemap and checked to not remove
    if (!n_obj.overlay) {
      return false;
    }
    obj.target.parentNode.remove();
    if (this._map.hasLayer(n_obj.layer)) {
      this._map.removeLayer(n_obj.layer);
    }

    return false;
  },

  _expand: function _expand() {
    L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
  },

  _collapse: function _collapse() {
    this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
  },

  _indexOf: function _indexOf(arr, obj) {
    for (var i = 0, j = arr.length; i < j; i++) {
      if (arr[i] === obj) {
        return i;
      }
    }
    return -1;
  }
});

L.control.groupedLayers = function (baseLayers, groupedOverlays, options) {
  return new L.Control.GroupedLayers(baseLayers, groupedOverlays, options);
};