import React,{useEffect, useMemo}from "react";
import { Marker, Popup ,useMap } from "react-leaflet";
import icon from "./icon";
const MarkerPosition = ({ address }) => {
    const map =useMap();
    const position =  useMemo(()=>{
        return [address.location.lat, address.location.lng]
    },[address.location.lat, address.location.lng]);
    useEffect(() => {
      map.flyTo(position,13,{
          animate:true
      })
    },[map, position]);
  return (
    <div>
      <Marker
        icon={icon}
        position={position}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </div>
  );
};

export default MarkerPosition;
