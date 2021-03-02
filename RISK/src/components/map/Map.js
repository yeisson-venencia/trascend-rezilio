import React, { useEffect, useState, useRef } from "react";
import { loadEsriModules } from "../../utils/loader";

export default function Map({ center }) {
  const mapEl = useRef();
  const [view, setView] = useState(null);

  useEffect(() => {
    // Use esri-loader to load the ArcGIS JS API Web map:
    loadEsriModules(["esri/WebMap", "esri/views/MapView"]).then(
      ([WebMap, MapView]) => {
        if (!mapEl) {
          // component or app was likely destroyed
          return;
        }
        // create the Map
        const webmap = new WebMap({
          portalItem: {
            id: "cce1c4747cac4a119c3c145c97a55e3b"
          }
        });
        // show the map at the element
        let view = new MapView({
          map: webmap,
          container: mapEl.current
        });
        // wait for the view to load
        view.when(() => {
          setView(view);
        });
      }
    );

    return () => {
      // this is run when the component unmounts and it should help
      // ensure that the map & view are scheduled for garbage collection
      setView(null);
    };
  }, []);

  // gets called ever time something changes the "center" state
  useEffect(() => {
    if (view && center) {
      view.center = center;
    }
  }, [center, view]);

  return <div className="map" ref={mapEl} />;
}
