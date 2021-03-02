import React from "react";
import { getWindowDimension, getDeviceTypeInfo } from "../../utils/Responsive";

const { width, height } = getWindowDimension();

export class Responsive extends React.PureComponent {
  state = { width, height };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
  }

  render = () => {
    const { children, displayIn } = this.props;
    const { width, height } = this.state;

    const dispInArr = displayIn.map((val) => val.toLowerCase());
    const shouldRenderChildren = this.shouldRender(dispInArr, width, height);

    return (
      <React.Fragment>{shouldRenderChildren ? children : null}</React.Fragment>
    );
  };

  handleResize = () => {
    const { width, height } = getWindowDimension();
    this.setState({ width, height });
  };

  shouldRender = (display, width, height) => {
    let device = getDeviceTypeInfo();

    if (display.includes(device.breakpoint)) {
      return true;
    }
    return false;
  };
}
