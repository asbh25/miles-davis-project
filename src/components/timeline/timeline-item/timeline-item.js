import React, { Component } from "react";
import "./timeline-item.css";
import { Tooltip } from "reactstrap";
import { getReleasedYearFromDate } from "../../../scripts/helpers";

export default class TimelineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseEntered: false,
    };
  }

  digIntoAlbum = () => {
    const { name } = this.props;
    this.props.switchToAlbum(name);
  };

  _isActive = (name) => {
    if (name === this.props.highlighted) return true;
    return false;
  };

  render() {
    const { icon, name, date, style, itemId } = this.props;
    const activeNormal = this._isActive(name) ? "item-container-active" : "";
    const activeHovered = this._isActive(name) ? "" : "";

    const itemClass = this.state.mouseEntered
      ? `box-shadow item-style ${activeHovered}`
      : `item-container item-style  box-shadow ${activeNormal}`;
    const containerClass = this.state.mouseEntered
      ? "vertical-timeline-custom move-top"
      : "vertical-timeline-custom";

    return (
      <div key={itemId} className={containerClass} style={style}>
        {/* album container start */}
        <div
          onClick={this.digIntoAlbum}
          className={itemClass}
          style={{ backgroundImage: `url(${icon})`, backgroundSize: "contain" }}
        >
          {/* start information about each album */}
          {this.props.showTooltip ? (
            <Tooltip
              style={{ borderRadius: 10 }}
              placement="left"
              isOpen={this.state.mouseEntered}
              target={itemId}
            >
              <div className="information-container">
                <img src={icon} alt="album" width={150} />
                <p style={{ paddingTop: 10 }}>{name}</p>
                <p>{date}</p>
              </div>
            </Tooltip>
          ) : null}

          {/* end information about each album */}
        </div>
        {/* album container start */}

        {/* date start */}
        <div>
          <p className="timeline-item-text">{getReleasedYearFromDate(date)}</p>
        </div>
        {/* date end */}
      </div>
    );
  }
}
