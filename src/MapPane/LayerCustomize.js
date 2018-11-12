/*
Woof, this one's not something I'm too proud of...
So basically I made this file because I knew that customizing each of the layers
within the leaflet map would require a lot of code, I housed it in
this js file, from which functions are exported allowing them
to be imported by mappane.js without compromizing the organization of
mappane.js which is arguably the most central component of this project.

it imports leaflet in order to be able to use its functions and objects
within the customization. Notice it does not import react-leaflet, as this
file could almost function independently from React because we need to
expose a great deal of the underlying leaflet code to be able to customize
things.
React-leaflet is a very surface level framework with which you can't accomplish
many things without working under the hood a bit.
*/

import * as React from 'react';
import Leaflet from 'leaflet';
import marker from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import React, { Component}  from 'react';


 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>



const categories = [
	'Geographic Feature',
	'Corps Relations',
	'Native American Encounter',
	'Important Campsite',
	'Natural History',
	''
];

const marker_colors = [
	'icon_yellow.svg',
	'icon_gray.svg',
	'icon_pink.svg',
	'icon_green.svg',
	'icon_blue.svg',
  'icon_none.svg',
	'map-marker-icon.png'
];

export function LayerStyle(name, cntxt) {
	context = cntxt;
	switch (name) {
		case 'biomes':
			return biomeStyle;
		case 'retpoi':
		case 'outpoi':
			return POIStyle;
		case 'retpoi':
		case 'outpoi':
			return POIStyle;
		case 'trail':
			return trailStyle;
		case '1803':
			return style1803;
		case 'Histrivers':
			return styleRiv;
		default:
			return null;
	}
}

var context = null; // augment scope of context

export function OnEachFeature(name, cntxt) {
	context = cntxt;
	switch (name) {
		case 'biomes':
			return onEachBiome;
		case 'retpoi':
		case 'outpoi':
			return onEachPOI;
		case 'trail':
			return onEachTrail;
		case 'tribes':
			return onEachTribe;
		case'1803':
			return onPolitical;
		case'Histrivers':
			return onRiv;
		default:
			return null;
	}
}


export function PointToLayer(name, cntxt) {
	context = cntxt;
	switch (name) {
		case 'retpoi':
			return pointToPOI;
		case 'outpoi':
			return pointToPOI;
		case 'tribes':
		  return pointToTribes;
		default:
			return null;
	}
}

function style1803(feature, layer){
	var color = '#000000';
	if (feature.properties.id === 1)
		color = '#00008B';
	if (feature.properties.id === 2)
		color = '#FFFF00';
	if (feature.properties.id === 3)
		color = '#FFFF00';
	if (feature.properties.id === 4)
		color = '#FF0000';

	if (feature.properties.id === 5)
		color = '#4682B4';

	return { fillColor: color, fillOpacity: 0.8, stroke: false };
}

function onPolitical(feature, layer){
	layer.bindPopup(feature.properties.NAME, {closeOnClick: false });
}

function onPolitical(feature, layer){
	layer.bindTooltip(feature.properties.NAME, {permanent: true});
}

function pointToTribes(feature, latlng) {
	var color = 'icon_none.svg';

	const teardrop = Leaflet.icon({
		iconUrl: color,
		iconSize: [40, 40],
		iconAnchor: [19, 35]
	});

	const geojsonMarkerOptions = {
		icon: teardrop,
		zIndexOffset: 10000

	};
	return Leaflet.marker(latlng, geojsonMarkerOptions);
}

function pointToPOI(feature, latlng) {
	var color = marker_colors[categories.indexOf(feature.properties.Category[0])];
	if (!color) color = 'map-marker-icon.png';

	const teardrop = Leaflet.icon({
		iconUrl: color,
		iconSize: [38, 38], // size of the icon
		iconAnchor: [19, 35] // point of the icon which will correspond to marker's location
	});

	const geojsonMarkerOptions = {
		icon: teardrop,
		zIndexOffset: 10000
		//title:feature.properties.Name
	};
	return Leaflet.marker(latlng, geojsonMarkerOptions); //.bindTooltip(feature.properties.Name)
}

function pointToCities(feature, latlng) {
	return new Leaflet.Marker(latlng, {
		icon: new Leaflet.DivIcon({
			className: 'my-div-icon',
			html: '<span>' + feature.properties.CITY_NAME + '</span>'
		})
	});
}

function POIStyle(feature) {
	return { opacity: 0 };
}

function trailStyle(feature) {
	if (feature.properties.JOURNEY === 'OUTBOUND')
		return {
			color: '#0000ff',
			opacity: context.props.activeTrail === 'outbound' ? 1 : 0
		};
	if (feature.properties.JOURNEY === 'RETURN')
		return {
			color: '#ff0000',
			opacity: context.props.activeTrail === 'return' ? 1 : 0
		};
	if (feature.properties.JOURNEY === 'OUTBOUND AND RETURN')
		return {
			color: context.props.activeTrail === 'outbound' ? '#0000ff' : '#ff0000'
		};
	console.log(feature);
}

function biomeStyle(feature) {
	//let biomes_color = biomes => ('#'+(10*biomes).toString(16)+(25*biomes).toString(16)+(10*biomes).toString(16))
	var color = '#000000';
	if (
		feature.properties.ECO_NAME.indexOf('forest') >= 0 ||
		feature.properties.ECO_NAME.indexOf('pine') >= 0 ||
		feature.properties.ECO_NAME.indexOf('everglades') >= 0
	)
		color = '#11dd11';
	if (
		feature.properties.ECO_NAME.indexOf('shrub') >= 0 ||
		feature.properties.ECO_NAME.indexOf('steppe') >= 0 ||
		feature.properties.ECO_NAME.indexOf('chaparral') >= 0
	)
		color = '#fcea9c';
	if (
		feature.properties.ECO_NAME.indexOf('grassland') >= 0 ||
		feature.properties.ECO_NAME.indexOf('prairies') >= 0 ||
		feature.properties.ECO_NAME.indexOf('savanna') >= 0
	)
		color = '#aae570';
	if (
		feature.properties.ECO_NAME.indexOf('desert') >= 0 ||
		feature.properties.ECO_NAME.indexOf('mezquital') >= 0
	)
		color = '#f2f4c8';
	return { fillColor: color, fillOpacity: 0.3, stroke: false };
}

//function nncStyle(feature, layer){}


function onEachBiome(feature, layer) {
	layer.bindPopup(feature.properties.ECO_NAME, {permanent: true});
}

function onEachPOI(feature, layer) {
  layer.bindTooltip(feature.properties.Name);
	layer.on({
		click: () => {
			const latOffset = -1.4;
			context.props.changePane('info', feature.properties);
			const ll = Leaflet.GeoJSON.coordsToLatLng([
				feature.geometry.coordinates[0] + latOffset,
				feature.geometry.coordinates[1]
			]);

      console.log(layer.getTooltip().options.permanent);

      if(!layer.getTooltip().options.permanent){
        layer.unbindTooltip();
        layer.bindTooltip(feature.properties.Name, {permanent: true});
      }
			else {
        layer.unbindTooltip();
        //unbind all
        layer.bindTooltip(feature.properties.Name, {permanent: false});
      }
		}
	});
}

function onEachTribe(feature, layer) {
	//marker.addTo(layer).bindPopup(feature.properties.Tribe, {autoClose:false}).openPopup();
	//layer.bindPopup(feature.properties.Tribe, {autoClose:false}).openPopup();
  layer.bindTooltip(feature.properties.Tribe, {permanent: true, className: 'tribeMarker'})

}

function onEachTrail(feature, layer) {
	//layer.on({click: ()=>(console.log(feature.properties))})
}
