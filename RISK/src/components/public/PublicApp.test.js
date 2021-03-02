import React from "react";
import ReactDOM from "react-dom";
import createComponentWithIntl from "../../utils/createComponentWithIntl";
import config from "../../config/config";
import { PublicAppTest as PublicApp } from "./PublicApp";
import { connect } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";

it("renders without crashing", () => {
	const div = document.createElement("div");

	const component = createComponentWithIntl(
		<Router initialEntries={["/"]} initialIndex={1}>
			<PublicApp />
		</Router>
	);

	ReactDOM.render(component, div);
});
