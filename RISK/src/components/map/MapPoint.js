import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";

const MapPoint = (props) => {
  // props.pointClick.forEach(element => {
  //     console.log(element[0]);
  // });
  const [graphic, setGraphic] = useState(null);
  useEffect(() => {
    loadModules(["esri/Graphic"])
      .then(([Graphic]) => {
        // Create a polygon geometry
        props.pointClick.forEach((element) => {
          const point = {
            //Create a point
            type: "point",
            longitude: element[1], //props.pointClick[0] ? props.pointClick[0][1] : -118.80657463861,
            latitude: element[0], // props.pointClick[0] ? props.pointClick[0][0] : 34.0005930608889
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 1,
            },
          };

          // Add the geometry and symbol to a new graphic
          const graphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
          });
          setGraphic(graphic);
          props.view.graphics.add(graphic);
        });
        //---------------
      })
      .catch((err) => console.error(err));

    return function cleanup() {
      props.view.graphics.remove(graphic);
    };
  }, [props]);

  return null;
};

export default MapPoint;
