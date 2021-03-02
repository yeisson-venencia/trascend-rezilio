import React from "react";

class HeaderMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: {
        title: props.plan.name,
      },
    };
  }

  componentDidMount = () => {};

  clickBack = (e) => {
    e.stopPropagation();
    this.props.onBackClick();
  };

  render = () => {
    return (
      <div className="container-fluid full plan-header mobile">
        <div className="col-12 title-wrapper text-left">
          <div className="back" onClick={(e) => this.clickBack(e)}>
            -
          </div>
          <div className="title">{this.state.model.title}</div>
        </div>
      </div>
    );
  };
}

export default HeaderMobile;
