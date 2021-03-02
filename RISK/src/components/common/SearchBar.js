import React from "react";
import "../../css/SearchBar.scss";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      search: "",
      placeholder: props.placeholder,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoaded: true,
    });
  }

  handleSearch(event) {
    this.setState({
      search: event.target.value,
    });

    this.props.search(event.target.value);
  }

  resetSearch() {
    this.setState({
      search: "",
    });

    this.props.reset();
  }

  render() {
    const { isLoaded } = this.state;
    const that = this;

    if (!isLoaded) {
      return null;
    } else {
      return (
        <div className="search-bar">
          <input
            className={
              that.state.search.length === 0 ? "search" : "search active"
            }
            value={that.state.search}
            placeholder={that.state.placeholder}
            onChange={that.handleSearch}
          />

          {that.state.search !== "" ? (
            <button className="close" onClick={that.resetSearch} />
          ) : null}
        </div>
      );
    }
  }
}

export default SearchBar;
