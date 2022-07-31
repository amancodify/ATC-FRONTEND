import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const renderTooltip = (props) => {
  return <Tooltip id="button-tooltip">{props}</Tooltip>;
};

const Overlay = ({ comment }) => (
  <div className="comments-main">
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 50, hide: 30 }}
      overlay={renderTooltip(comment)}
    >
      <Button className="overlaybutton" variant="">
        Comments <i className="fa fa-comment comment-icon"></i>
      </Button>
    </OverlayTrigger>
  </div>
);

export default Overlay;
