import React from "react";
import "./Login.timeout.scss";
import { FormattedMessage } from "react-intl";

class Timeout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tick: window.appConfig.logoutTimeout / 1000,
      max: window.appConfig.logoutTimeout / 1000,
    };
  }

  componentDidMount() {
    const that = this;

    that.logoutTimeout = setTimeout(
      that.props.logout,
      window.appConfig.logoutTimeout
    );

    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    clearInterval(this.intervalID);
  }

  tick() {
    let tick = this.state.tick - 1;

    this.setState({
      tick: tick,
    });
  }

  render() {
    const that = this;

    let val = Math.round((that.state.tick / that.state.max) * 100),
      r = 71,
      max = Math.PI * r * 2,
      min = Math.floor(that.state.tick / 60),
      sec = that.state.tick % 60;

    return (
      <div className="timeout">
        <div className="fade"></div>

        <div className="popup">
          <h1>
            <FormattedMessage id="login.timeout.title" />
          </h1>
          <p>
            <FormattedMessage id="login.timeout.text" values={{ br: <br /> }} />
          </p>

          <div className="anim">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle className="blue" cx="75" cy="75" r={r} />
              <circle
                className="grey"
                cx="75"
                cy="75"
                r={r}
                strokeDasharray={
                  ((100 - val) / 100) * max + " " + (val / 100) * max
                }
                strokeDashoffset={max / 4}
              />
            </svg>
            <div className="time">
              {min.toString().padStart(2, "0")}:
              {sec.toString().padStart(2, "0")}
            </div>
          </div>

          <button onClick={() => that.props.hideWarning()}>
            <FormattedMessage id="login.timeout.button" />
          </button>
        </div>
      </div>
    );
  }
}

export default Timeout;
