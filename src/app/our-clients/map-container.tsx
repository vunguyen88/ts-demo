import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import { GoogleMap, InfoWindow, MarkerF } from "@react-google-maps/api";
import { generateFirestoreId } from "@/lib/utils/helper";
import { GeoLocation, LocationInfo } from "@/types/location";
import { Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
// import LocationContext from "@/contexts/locationContext";

interface Marker {
  geoLocation: GeoLocation;
}

interface MapContainerProps {
  windowSize: string;
  currentLatitude?: number;
  currentLongitude?: number;
  // setMapCenter: (center: GeoLocation) => void;
  userCurrentPosition: GeoLocation;
  locationData: LocationInfoWithDistance[];
  updateLocationDistances: (data: LocationInfoWithDistance[]) => void;
}

interface LocationInfoWithDistance extends LocationInfo {
  distanceFromCenterPoint?: string;
  icon?: google.maps.Icon | google.maps.Symbol;
}

const MapContainer: React.FC<MapContainerProps> = ({
  windowSize,
  currentLatitude,
  // setMapCenter,
  userCurrentPosition,
  currentLongitude,
  locationData = [],
  updateLocationDistances,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  // const [activeMarker, setActiveMarker] = useState<GeoLocation>({
  //   latitude: 28.540443472482256,
  //   longitude: -81.15405091551375,
  // });
  const [activeMarker, setActiveMarker] = useState<LocationInfoWithDistance | null>(null);
  const [markers, setMarkers] = useState<LocationInfoWithDistance[]>([...locationData]);
  const [userPosition, setUserPosition] = useState(userCurrentPosition);
  // const locationContext = useContext(LocationContext);
  // const selectedLocation = locationContext.defaultLocation;

  // test data to be removed
  {/* @ts-ignore */}
  const selectedLocation: LocationInfoWithDistance = {
    "timeSlotSizeMinutes": 15,
    "socialUrls": {},
    "locationStatus": {"isActive": true},
    "servicesOffered": ["1","2"],
    "locationBlockedDays": ["0","1"],
    "locationType": "sdf",
    "locationTimeZone": "sdf",
    "locationNameUrl": "sdf",
    "locationId": "VEQrdKlZLkQHVu9FugkP",
    "closedDays": [1,2],
    "acceptWalkins": true,
    "address": {
        "street": "425 Avalon Park S Blvd #700",
        "city": "Orlando",
        "state": "FL",
        "zipCode": "32828"
    },
    "businessHours": {
        "0": {
            "from": 10.5,
            "to": 17
        },
        "1": {
            "from": 9.5,
            "to": 19
        },
        "2": {
            "from": 9.5,
            "to": 19
        },
        "3": {
            "from": 9.5,
            "to": 19
        },
        "4": {
            "from": 9.5,
            "to": 19
        },
        "5": {
            "from": 9.5,
            "to": 19
        },
        "6": {
            "from": 9.5,
            "to": 19
        }
    },
    "geoLocation": {
        "longitude": -81.14901583453576,
        "latitude": 28.537853902495254
    },
    "locationLogo": "https://storage.googleapis.com/mint-booking-dev.appspot.com/logos/Black%20%26%20White%20Minimalist%20Aesthetic%20Initials%20Font%20Logo.jpg",
    "locationName": "Diamond Nails & Spa",
    "phoneNumber": "4071112222",
    "prefixUrl": "/locations/diamond+nails+spa-425+Avalon+Park+S+Blvd"
  }


  const [center, setCenter] = useState<GeoLocation>({
    latitude: currentLatitude ? currentLatitude : 28.540443472482256,
    longitude: currentLongitude ? currentLongitude : -81.15405091551375,
  });

  const blueDot: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillOpacity: 1,
    strokeWeight: 2,
    fillColor: '#5384ED',
    strokeColor: '#ffffff',
  };

  // useEffect(() => {
  //   if (selectedLocation) {
  //     let currentUserLocation = { geoLocation: { latitude: userCurrentPosition.latitude, longitude: userCurrentPosition.longitude } };
  //     let distanceBetweenUserAndLocation = (calculateDistance(currentUserLocation, selectedLocation) * 0.000621371192).toFixed(1);
  //     return handleActiveMarker(selectedLocation, parseFloat(distanceBetweenUserAndLocation));
  //   }
  // }, [selectedLocation]);

  useEffect(() => {
    updateDistances(locationData);
    markers.forEach((marker, index) => {
      if (marker.locationName === "UserLocation") {
        {/* @ts-ignore */}
        markers[index] = {
          locationId: generateFirestoreId(),
          locationName: "UserLocation",
          geoLocation: { latitude: userCurrentPosition.latitude, longitude: userCurrentPosition.longitude },
          icon: blueDot,
        };
        setMarkers([...markers]);
        return;
      }
    });
    
    setMarkers([
      // @ts-ignore
      ...markers,
      // @ts-ignore
      {
        locationId: generateFirestoreId(),
        locationName: "UserLocation",
        geoLocation: { latitude: userCurrentPosition.latitude, longitude: userCurrentPosition.longitude },
        icon: blueDot,
      },
    ]);
    handleSetCenter(userCurrentPosition);
  }, [userCurrentPosition]);

  const handleSetCenter = (geoLocation: GeoLocation) => {
    if (mapRef.current) {
      const map = mapRef.current;
      // map.setCenter(geoLocation);
      map.setCenter({ lat: geoLocation.latitude, lng: geoLocation.longitude });
      map.setZoom(13);
    } else {
      setCenter(geoLocation);
    }
  };

  const handleActiveMarker = (marker: LocationInfoWithDistance, distance: number = 1) => {
    if (marker === activeMarker) {
     // if (activeMarker && marker.latitude === activeMarker.latitude && marker.longitude === activeMarker.longitude) {
      return;
    }
    
    if (mapRef.current && selectedLocation) {
      const map = mapRef.current;
      const { latitude, longitude } = selectedLocation.geoLocation;
      map.panTo({ lat: selectedLocation.geoLocation.latitude, lng: selectedLocation.geoLocation.longitude});
      if (distance <= 2.8) {
        map.setZoom(14);
      } else if (distance > 2.8 && distance <= 4) {
        map.setZoom(12);
      } else if (distance > 4 && distance <= 8) {
        map.setZoom(11);
      } else {
        map.setZoom(10);
      }
    }

    setActiveMarker(marker)
  };

  const calculateDistance = (marker1: Marker, marker2: Marker): number => {
    const distance = google?.maps?.geometry?.spherical?.computeDistanceBetween(
      new google.maps.LatLng(marker1.geoLocation.latitude, marker1.geoLocation.longitude),
      new google.maps.LatLng(marker2.geoLocation.latitude, marker2.geoLocation.longitude)
    );
    return distance || 0;
  };

  const updateDistances = (markers: LocationInfoWithDistance[]) => {
    let centerPoint = { geoLocation: { latitude: userCurrentPosition.latitude, longitude: userCurrentPosition.longitude } };
    let updatedLocationData = markers.map(marker => {
      let distance = calculateDistance(centerPoint, marker);

      return { ...marker, distanceFromCenterPoint: (distance * 0.000621371192).toFixed(1) };
    });
    updateLocationDistances(updatedLocationData);
  };

  return (
    <GoogleMap
      onLoad={map => {mapRef.current = map}}
      mapContainerStyle={
        windowSize === "mobile"
          ? { width: "100%", height: "250px" }
          : windowSize === "tablet"
          ? { width: "100%", height: "320px" }
          : { width: "100%", height: "400px" }
      }
      center={activeMarker ? { lat: activeMarker.geoLocation.latitude, lng: activeMarker.geoLocation.longitude } : { lat: center.latitude, lng: center.longitude }}
      zoom={windowSize === 'mobile' ? 13 : 15}
    >
      {markers.length > 0 && markers.map(marker => (
        <MarkerF
          key={marker.locationId}
          position={{ lat: marker.geoLocation.latitude, lng: marker.geoLocation.longitude }}
          onClick={() => handleActiveMarker(marker)}
          icon={marker.icon}
        >
            {
              activeMarker?.locationId === marker.locationId && activeMarker?.locationName !== 'UserLocation'
                ? <InfoWindow onCloseClick={() => {}}>
                  <div>
                    {/* @ts-ignore */}
                    <Typography className="font-medium text-sm">{marker.locationName}</Typography>
                    {/* @ts-ignore */}
                    <Typography className="font-light text-sm">{marker?.address?.street}</Typography>
                    {/* @ts-ignore */}
                    <Typography className="font-light text-xs">{`${marker?.address?.city}, ${marker?.address?.state} ${marker?.address?.zipCode}`}</Typography>
                    {/* @ts-ignore */}
                    <Link href={marker.googleMapUrl} target="_blank">
                      {/* @ts-ignore */}
                      <Typography className="cursor-pointer text-sm text-blue-800 font-normal">View on Google Map</Typography>
                    </Link>
                  </div>
                  </InfoWindow>
                : null
            }
        </MarkerF>
      ))}
    </GoogleMap>
  );
};

export default MapContainer;
