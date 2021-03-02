// uses bootstrap breakpoints
/*
xs: 0,
sm: 576px,
md: 768px,
lg: 992px,
xl: 1200px,
xxl: 1400px
*/

// original version https://github.com/applike/responsive-react/tree/master/src

export const DeviceWidthObject = {
  xs: { max: 575, min: 0 },
  sm: { max: 767, min: 576 },
  md: { max: 991, min: 768 },
  lg: { max: 1199, min: 992 },
  xl: { max: 1399, min: 1200 },
  xxl: { max: 1920, min: 1400 },
};

export const getWindowDimension = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width, height };
};

export const getDeviceTypeInfo = (windowDimension = getWindowDimension()) => {
  const { width, height } = windowDimension;

  const buildDeviceDetails = {
    width,
    height,
    breakpoint: "xs",
    orientation: "Portrait",
  };

  if (height < width) {
    // Orientation is landscape
    buildDeviceDetails.orientation = "Landscape";
  } else {
    // Orientation is portrait
    buildDeviceDetails.orientation = "Portrait";
  }

  // get the breakpoint
  for (const devc in DeviceWidthObject) {
    if (
      width <= DeviceWidthObject[devc].max &&
      width >= DeviceWidthObject[devc].min
    ) {
      buildDeviceDetails.breakpoint = devc;
      break;
    }
  }
  return buildDeviceDetails;
};
