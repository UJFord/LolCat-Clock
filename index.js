//STORE CLASS
class Store{
	//get time sets
	static getTimeSets() {
		let timeSets;
		if(localStorage.getItem('timeSets') === null){
			//if it's first time
			timeSets = [5, 12, 2, false];//[wake time, lunch time, nap time, party state]
		}else{
			timeSets = JSON.parse(localStorage.getItem('timeSets'));
		}
		return timeSets;
	}
	//set time sets
	static changeTimeSets(timeSet, time) {
		let timeSets = Store.getTimeSets();
		
		timeSets[time] = timeSet;
		
		localStorage.setItem('timeSets', JSON.stringify(timeSets))
	}
}

//STATE PICTURES

//special times pic
let wakePic = "url('/img/wakeTime.jpg')";
let lunchPic = "url('/img/lunchTime.jpg')";
let napPic = "url('/img/napTime.jpg')";
//general pic
let partyPic = "url('/img/partyTime.jpg')";
let morningPic = "url('/img/morningTime.jpg')";
let afternoonPic = "url('/img/normalTime.jpg')";
let eveningPic = "url('/img/sleepTime.jpg')";

//GRABBING DOMS

//time display element
let timeDisplay = document.querySelector('#time');
//time sets
let wake = document.querySelector('#wake');
let lunch = document.querySelector('#lunch');
let nap = document.querySelector('#nap');
//status section
let stateBG = document.querySelector('#state');
let stateTxt = document.querySelector('#party-state');
//party button
let partyToggle = document.querySelector('#toggle-party');

//STARTUPS OF DEFAULT DISPLAY & VALUES

//RUNNING TIME DISPLAY
//store hour time
let hour;
//store meridian
let meridian = 'am';
//display empty time
timeDisplay.innerText = `00:00:00 ${meridian}!`;
//STATUS DISPLAY
//store status pic
let picState;
//store status text
let state = "Yeha";
stateTxt.innerText = state;
//SPECIAL TIMES VALUE
//set special time values form local storage
wake.value = Store.getTimeSets()[0];
lunch.value = Store.getTimeSets()[1];
nap.value = Store.getTimeSets()[2];
//set special times
let wakeTime = wake.value;
let lunchTime = lunch.value;
let napTime = nap.value;
//set special times for undos
let pastWake = wake.value;
let pastLunch = lunch.value;
let pastNap = nap.value;
//PARTY STATE
//set party state
let party = Store.getTimeSets()[3];
//DISPLAY STATUS ONLOAD
//display time
timeDisplay.innerText = getTime();
//display bg and status
updateTime();

//RUN EVERY SECOND
setInterval(()=>{
	timeDisplay.innerText = getTime();
	if(!party)updateTime();
},1000);

//FUNCTIONS

//two digit function
function twoDigit(num){
	if(num < 10)return '0'+ num;
	return num
}
//12 hour formatting
function hourFormat(num){
	if(num > 12){
		meridian = 'pm';
		return twoDigit(num-12);
	}else{
		meridian = 'am';
		return twoDigit(num);
	}
}
//time function
function getTime(){
	let time = new Date();
	hour = time.getHours();
	return `${hourFormat(hour)}:${twoDigit(time.getMinutes())}:${twoDigit(time.getSeconds())} ${meridian}!`;
}
//change status function
function changeStatus(bg, text){
	picState = bg;
	stateBG.style.backgroundImage = picState;
	state = text;
	stateTxt.innerText = `"${state}"`;
}
//update statuses function
function updateTime(){
	switch(hour){
		case parseInt(wake.value):
		case parseInt(lunch.value):
		case parseInt(nap.value):
			isSpecialTime();
		break;
		default:
			if(hour < 12){
				changeStatus(morningPic, 'good morning!')
			}
			if(hour >= 12 && hour <= 17){
				changeStatus(afternoonPic, 'good afternoon!')
			}
			if(hour > 17){
				changeStatus(eveningPic, 'good evening!')
			}
	}
}
//special times function
function isSpecialTime(){
	switch(hour){
		case parseInt(wake.value):
			changeStatus(wakePic, 'wake up!');
		break;
		case parseInt(lunch.value):
			changeStatus(lunchPic, 'it\'s lunch time!');
		break;
		case parseInt(nap.value):
			changeStatus(napPic, 'let\'s take a nap...');
	}
}

//PARTY STATE
partyToggle.onclick = () => {
	//turn party on/off
	party = !party;
	Store.changeTimeSets(!party, 3);
	if(party){
		changeStatus(partyPic, 'let\'s party!');
		partyToggle.innerText = 'party over!';
		partyToggle.style.backgroundColor = '#0A8DAB';
	}else{
		updateTime();
		partyToggle.innerText = 'party time!';
		partyToggle.style.backgroundColor = '#222';
	}
}

//SPECIAL TIME EVENTS
//wake
wake.addEventListener("change", () => {
	if(wake.value == Store.getTimeSets()[1] || wake.value == Store.getTimeSets()[2]){
		wake.value = pastWake;
	}else{
		Store.changeTimeSets(wake.value, 0);
		wakeTime = Store.getTimeSets()[0];
		updateTime();
		pastWake = wakeTime;
	}
	console.log(Store.getTimeSets()[0]);
});
//lunch
lunch.addEventListener("change", () => {
	if(lunch.value == Store.getTimeSets()[0] || lunch.value == Store.getTimeSets()[2]){
		lunch.value = pastLunch;
	}else{
		Store.changeTimeSets(lunch.value, 1);
		lunchTime = Store.getTimeSets()[1];
		updateTime();
		pastLunch = lunchTime;
	}
	console.log(Store.getTimeSets()[1]);
});
//nap
nap.addEventListener("change", () => {
	if(nap.value == Store.getTimeSets()[0] || nap.value == Store.getTimeSets()[1]){
		nap.value = pastNap;
	}else{
		Store.changeTimeSets(nap.value, 2);
		napTime = Store.getTimeSets()[2];
		updateTime();
		pastNap = napTime;
	}
	console.log(Store.getTimeSets()[2]);
});