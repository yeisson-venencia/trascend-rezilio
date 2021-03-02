import React from "react";
import { FormattedMessage } from "react-intl";

const PublicationNoData = () => {
  return (
    <div className="publication-nodata">
      <FormattedMessage id="publication.list.noitems" />
    </div>
  );
};

export default PublicationNoData;
