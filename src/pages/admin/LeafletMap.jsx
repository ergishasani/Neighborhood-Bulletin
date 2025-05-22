import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getPosts } from "../../firebase/firestore";
import "./_leafletMap.scss";

export default function LeafletMap() {
    const [markers, setMarkers] = useState([]);
    useEffect(() => {
        async function load() {
            const res = await getPosts({ limitCount: 500 });
            if (!res.success) return;
            // assume each post has `.coords = {lat,lng}` in Firestore
            setMarkers(res.data.filter(p=>p.coords));
        }
        load();
    }, []);
    return (
        <MapContainer center={[0,0]} zoom={2} style={{height:"100%",width:"100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {markers.map(p=>(
                <Marker position={[p.coords.lat,p.coords.lng]} key={p.id}>
                    <Popup>{p.title}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
