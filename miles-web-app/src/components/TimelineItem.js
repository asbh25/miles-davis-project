import React, { Component } from 'react';
import '../styles/timeline-item.css';
import { Tooltip } from 'reactstrap';
import {getReleasedYearFromDate} from '../scripts/helpers';

export default class TimelineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
        mouseEntered: false,
    };
  }
  
  digIntoAlbum = () => {
    const {name} = this.props;
    this.props.switchToAlbum(name);
  }

  _isActive = (name) => {
    if(name === this.props.highlighted)
      return true;
    return false;
  }

  render() {
    const { link, icon, name, date, itemId, style} = this.props;
    const activeNormal = this._isActive(name) ? "item-container-active" : "";
    const activeHovered = this._isActive(name) ? "item-container-hovered-active" : "";

    const itemClass = this.state.mouseEntered ? `item-container-hovered ${activeHovered}` : `item-container ${activeNormal}`
    const containerClass = this.state.mouseEntered ? "vertical-timeline move-top" : "vertical-timeline"

    return (
      <div className={containerClass} style={style}>
        {/* album container start */}
        <div id={itemId}
            onClick={this.digIntoAlbum}
            onMouseEnter={() => this.setState({mouseEntered: !this.state.mouseEntered})} 
            onMouseLeave={() => this.setState({mouseEntered: !this.state.mouseEntered})}
            className={itemClass}
            style={{backgroundImage: `url(${icon})`}}>
          {/* start information about each album */}
          {this.props.showTooltip ? 
            <Tooltip style={{borderRadius: 10,}} placement="left" isOpen={this.state.mouseEntered} target={itemId}>
              <div className="information-container">
                <img src={icon} alt="album" width={150}/>
                <p style={{paddingTop: 10}}>{name}</p>
                <p>{date}</p>
              </div>
            </Tooltip> : null
          }
         
          {/* end information about each album */}
        </div>
        {/* album container start */}

        {/* date start */}
        <div>
          <p className="lead">{getReleasedYearFromDate(date)}</p>
        </div>
        {/* date end */}
    </div>
    );
  }
}
