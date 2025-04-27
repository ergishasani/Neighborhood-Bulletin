// src/components/PostsMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./PostsMap.scss";

export default function PostsMap({ posts, userCoords }) {
    const center = userCoords || { lat: 0, lng: 0 };
    return (
        <MapContainer center={center} zoom={13} className="posts-map">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            {userCoords && (
                <Marker position={userCoords}>
                    <Popup>Your location</Popup>
                </Marker>
            )}
            {posts
                .filter((p) => p.coords)
                .map((p) => (
                    <Marker key={p.id} position={p.coords}>
                        <Popup>
                            <strong>{p.title}</strong>
                            <br />
                            {p.location}
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}
