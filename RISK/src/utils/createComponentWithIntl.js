import React from "react";
import { IntlProvider } from "react-intl";
import en from "../translations/en.json";

const createComponentWithIntl = (
	children,
	props = { locale: "en", key: "en", messages: en }
) => {
	return <IntlProvider {...props}>{children}</IntlProvider>;
};

export default createComponentWithIntl;
