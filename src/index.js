import React from "react";
import { render } from "react-dom";
import isMobile from "is-mobile";
import { Spring, TransitionSpring } from "react-motion";

const config = [253, 20];
const spring = (values) => ({val: {...values}, config });
const getProfileInitialSpring = () => spring({size: 40, left: 25, top: 5, radius: 100});

const ProfilePicture = ({ip: { val: {left, top, size, radius} }}) => (
  <div className="profilePicture" style={{width: size, height: size, left, top, borderRadius: `${radius}%`}}/>
);

const ProspectList = ({ prospects, comparingId, onSelectProspect }) => <div className="prospectList">
<div className="prospectListHeader">Click on any person to see how you two look together!</div>
<div className="prospectListContent">{prospects.map((prospect) =>
  <Prospect key={prospect.id} onClick={onSelectProspect.bind(this, prospect)} comparing={comparingId === prospect.id} prospect={prospect} />
)}</div></div>

const Prospect = (props) => <div className="prospectWrapper"><div className={`prospect ${props.comparing ? "is-comparing" : ""}`}
  onClick={(ev) => props.onClick(ev.target.getBoundingClientRect.bind(ev.target))}><img src={props.prospect.src} width={60}/></div>
  <div className="prospectName">{props.prospect.fullName}</div></div>;

const AnimatedProspect = ({ip: { val: { left, top, size, radius}}, prospect: {src}, onClick}) => <div className="prospect"
  style={{position: "absolute", left, top, width: size, height: size, borderRadius: `${radius}%`}} onClick={onClick} >
  <img src={src} width={size}/></div>;

const CompareFrame = ({ prospect }) => <div className={`compareFrame ${prospect ? "is-comparing" : ""}`}>
  {prospect && <div className="compareFrameNames">
    <span className="compareFrameName">{prospect.fullName}</span> & <span className="compareFrameName">Brad Pitt</span>
  </div>}
</div>

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {comparingId: null, prospectsDimensions: {}};
  }

  render () {
    return <div>
      <div className="header" onClick={this._stopComparing.bind(this)} >
        <Spring defaultValue={getProfileInitialSpring()} endValue={this._getProfileEndValue.bind(this)} >
          {ip => <ProfilePicture ip={ip} />}
        </Spring>
      </div>
      <ProspectList comparingId={this.state.comparingId} onSelectProspect={this._handleProspectClick.bind(this)}
        prospects={Object.keys(PROSPECT_DATA).map((prospectId) => PROSPECT_DATA[prospectId])} />
      <CompareFrame prospect={PROSPECT_DATA[this.state.comparingId]} />
      <TransitionSpring willEnter={this._animatedProspectWillEnterOrLeave.bind(this)}
        willLeave={this._animatedProspectWillEnterOrLeave.bind(this)}
        endValue={this._getAnimatedProspectEndValue()}>
        {currentValue => <div>{Object.keys(currentValue).map(key =>
          <AnimatedProspect onClick={this._stopComparing.bind(this)} key={key} ip={currentValue[key]} prospect={PROSPECT_DATA[key]}/>
        )}</div>}
      </TransitionSpring>
    </div>;
  }

  _stopComparing () {
    this.setState({comparingId: null});
  }

  _getProfileEndValue (prev) {
    if (this.state.comparingId !== null) {
      const radius = prev.val.size < 150 ? 80 : 0;
      return spring({size: 380, left: 860, top: 100, radius});
    } else {
      return getProfileInitialSpring();
    }
  }

  _animatedProspectWillEnterOrLeave(key) {
    const left = this.state.prospectsDimensions[key].left;
    const top = this.state.prospectsDimensions[key].top;

    return {val: {size: 60, left, top, radius: 100}, config};
  }

  _getAnimatedProspectEndValue(prev) {
    return this.state.comparingId ? {[this.state.comparingId]: {val: {size: 380, left: 470, top: 100, radius: 0}, config}} : {};
  }

  _handleProspectClick ({ id }, getDimensions) {
    const {left, top, right} = getDimensions();
    const prospectsDimensions = {...this.state.prospectsDimensions, [id]: {id, left, right, top}};
    const comparingId = this.state.comparingId === id ? null : id;
    this.setState({comparingId, prospectsDimensions});
  }
}

const getEl = document.getElementById.bind(document);
isMobile() ? getEl('mobileBlocker').setAttribute("style", "") : render(<App />, getEl('reactContainer'));
