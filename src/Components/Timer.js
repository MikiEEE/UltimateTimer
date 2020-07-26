import React from 'react';

import "../Style/Timer.css"
import 'bootstrap/dist/css/bootstrap.min.css';




class Timer extends React.Component {


	constructor(props) {

		super(props);

		this.state = {
			time: 0,
			originalTime:0,
			ticker:1000,
			speed:"1x",
			interval: null,
			timeInput:"(Min)",
			pausePlay:"||",
			warning:"",
		};

		this.newTimer = this.newTimer.bind(this);
		this.setTimeInput= this.setTimeInput.bind(this);
		this.adjustSpeed = this.adjustSpeed.bind(this);
		this.pausePlay = this.pausePlay.bind(this);
	}


	newTimer(){

		if(isNaN(this.state.timeInput)){
			this.setState({
				timeInput:"invalid input"
			});
		} else {

			if(this.state.interval) {
				clearInterval(this.state.interval);
			}

			let interval = setInterval(() => {
					let time = this.state.time - 1000;
					this.setState({time:time})
					styler(this);
				},
				this.state.ticker
			);

			this.setState({
				time: timeToMill(this.state.timeInput),
				originalTime:timeToMill(this.state.timeInput),
				interval:interval,
				warning:"",
				pausePlay:"||", 
				timeInput:"(Min)"
			});

			document.getElementById('alerts').classList.remove("warning");
			document.getElementById('alerts').classList.remove("blink_me");

		}

	}


	setTimeInput(event) {

		this.setState({
			timeInput:event.target.value
		});
	}


	adjustSpeed(modifier, multiplier) {
		
		if(this.state.interval){
			clearInterval(this.state.interval);

			let interval = setInterval(() => {
					let time = this.state.time - 1000;
					this.setState({time:time})
					styler(this);
				},
				modifier
			);

			this.setState({
				interval:interval,
				ticker:modifier,
				speed:multiplier
			});
		} else {
			this.setState({
				ticker:modifier,
				speed:multiplier
			});
		}

		let speedbuttons = document.getElementsByClassName("speed-button");
		
		Array.from(speedbuttons).forEach((button) => {
			button.classList.remove("selected");
		});

		document.getElementById(multiplier).classList.add("selected");
	}


	pausePlay() {

		if(this.state.interval) {
			clearInterval(this.state.interval);
			this.setState({
				interval:null,
				pausePlay:"▶"
			});
		} else if(this.state.pausePlay === "▶") {
			let interval = setInterval(() => {
					let time = this.state.time - 1000;
					this.setState({time:time})
					styler(this);
				},
				this.state.ticker
			);

			this.setState({
				interval:interval,
				pausePlay:"||"
			});
		}
	}


	render() {
		return (
				<div className="contain">
					<section className="time-input-row">
						<label className="label">Countdown:</label>
						<input className="time-input" type="text" value={this.state.timeInput} onChange={this.setTimeInput}/>
						<div>
							<input className="start-button" type="button" onClick={()=>this.newTimer()} value="START"/>
						</div>
					</section>
					<section className="time-display-row above">
						<h3 className="warning-label" id="">{this.state.warning}</h3><br/>
					</section>
					<section className="time-display-row middle">
							<div className="time-display">
								<label className="time" id="alerts">{millToTime(this.state.time)}</label>
							</div>
					</section>
					<aside className="aside">
						<input className="button-round" type="button" onClick={()=>this.pausePlay()} value={this.state.pausePlay}/>
					</aside>
					<section className="button-row footer">
								<div className="in-row">
									<input type="button" id="1x" className="speed-button selected" onClick={()=>this.adjustSpeed(1000,"1x")} value="1X"/>
								</div>
								<div className="in-row">
									<input type="button" id="1.5x" className="speed-button" onClick={()=>this.adjustSpeed(667,"1.5x")} value="1.5X"/>
								</div>
								<div className="in-row">
									<input type="button" id="2x" className="speed-button" onClick={()=>this.adjustSpeed(500,"2x")} value="2X"/>
								</div>
					</section>
				</div>
		);
	}

}


function millToTime(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function  timeToMill(minutes) {
	//Does not account for time over the 
	//2 digit limit in minutes
	return((minutes*60)*1000);
}


function styler(obj) {

	if(obj.state.time <= 0){
		clearInterval(obj.state.interval);
		obj.setState({
						interval:null,
						time:0,
						warning:"Times Up!"
					});

	}

	if(obj.state.time >= obj.state.originalTime/2 - 500 && obj.state.time <= obj.state.originalTime/2 + 500) {
		obj.setState({
			warning:"More than halfway there!"
		});
	}

	if(obj.state.time < 20001) {
		document.getElementById('alerts').classList.add("warning");
		obj.setState({
			state:obj.state
		});
	}

	if(obj.state.time < 10001){
		document.getElementById('alerts').classList.add("blink_me");
		obj.setState({
			state:obj.state
		});
	}
}


export default Timer;