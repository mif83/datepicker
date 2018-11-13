import data from"./data";

class DateRange extends HTMLElement {
	static get observedAttributes() {
		return [
			"opened",
            "from",
            "to"
		]
	}

    constructor(){
        super();
    }
    connectedCallback() {
        this.dateFrom =  new Date();
        this.dateTo = new Date();
        let initTitle = `${getShornMonthName(this.dateFrom)} ${this.dateFrom.getDate()}`;
        this.innerHTML = `
        <div class="head"><span class="from">${initTitle}</span> - <span class="to">${initTitle}</span></div>
        <div class="content">
            <div class="select-wrapper">
                <custom-select data-arr="term"></custom-select>
            </div>
            <div class="select-wrapper">
                <custom-select data-arr="zones"></custom-select>
            </div>
            <div class="range-wrapper">
                <label>From:
                    <date-picker class="datepicker" data-type="from" ></date-picker>
                </label>
                <label>To:
                    <date-picker class="datepicker" data-type="to" ></date-picker>
                </label>
            </div>
            <div class="buttons">
                <button class="cancel">Cancel</button>
                <button class="apply">Apply</button>
            </div>
        </div>
    `;
        this.init();
    }

    changeDateOnCalendar (e) {
	    let month =  getShornMonthName(e.detail.date);

        let type = e.detail.type;
        let titleElem = document.querySelector(`.head .${type}`);
        titleElem.innerText = `${month} ${e.detail.day}`;
        e.stopPropagation();
    }
    setIntervals (e, that) {
        e.stopPropagation();
        // console.log(e.detail);
        if (e.detail.type === "zones") {
            return
        }
	    let date = new Date();
	    switch (+e.detail.id) {
		    case 0:

			    break;

		    case 1:
		        // today
			    that.dateFrom =  date;
			    that.dateTo = new Date();
			    break;

		    case 2:
                 // 7 days
			    that.dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
			    that.dateTo = new Date();
			    break;

		    case 3:
                // 30 days
			    that.dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
			    that.dateTo = new Date();
			    break;
		    case 4:
                // 90 days
			    that.dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 90);
			    that.dateTo = new Date();
			    break;
	    }
	    let dataElemFrom = that.parentElement.parentElement.querySelector(".datepicker[data-type=from]");
	    let dataElemTo = that.parentElement.parentElement.querySelector(".datepicker[data-type=to]");
	    dataElemFrom.dataset.val = that.dateFrom.valueOf();
	    dataElemTo.dataset.val = that.dateTo.valueOf();
	    let eventFrom = new CustomEvent("custom", {
		    "detail": {
			    date: that.dateFrom,
			    day: that.dateFrom.getDate(),
			    type: "from"
		    },
		    bubbles: true
	    });
	    let eventTo = new CustomEvent("custom", {
		    "detail": {
			    date: that.dateTo,
			    day: that.dateTo.getDate(),
			    type: "to"
		    },
		    bubbles: true
	    });
	    that.changeDateOnCalendar(eventFrom);
	    that.changeDateOnCalendar(eventTo);


    }
	get opened() {
		return (this.getAttribute("opened") !== null);
	}

	set opened(state) {
		if (!!state) {
			this.setAttribute("opened", "");
		} else {
			this.removeAttribute("opened");
		}
	};
	attributeChangedCallback(attrName, oldVal, newVal) {
		switch (attrName) {
			case "opened":
				const opened = newVal !== null;
				break;
			case "from":
				console.log("from", newVal);
				break;
			case "to":
				console.log("to", newVal);
				break;
		}
	}
	sendEvent (from, to) {
        let event = new CustomEvent("change", {
            "detail": {
                "from": new Date(from),
                "to": new Date(to),
            },
            bubbles: true
        });
        this.dispatchEvent(event);
    }
    init() {
        let datePickers =  document.querySelectorAll("date-picker");
        for (let i = 0; i < datePickers.length; i++) {
	        datePickers[i].addEventListener("change", this.changeDateOnCalendar);
        }
        let customSelect = document.querySelectorAll("custom-select");
	    for (let i = 0; i < datePickers.length; i++) {
		    customSelect[i].addEventListener("change", e => {
		        // console.log("custom-select", e.detail);
		        this.setIntervals(e, this);
		    });
	    }
	    let cancels = document.querySelectorAll(".buttons .cancel");
	    for (let i = 0; i < cancels.length; i++) {
		    cancels[i].onclick = (e) => {
		        this.opened = false;
            }
	    }
	    let applys = document.querySelectorAll(".buttons .apply");

	    for (let i = 0; i < applys.length; i++) {
		    applys[i].onclick = (e) => {

                let elemFrom = this.querySelector(`date-picker[data-type="from"]`);
                let elemTo = this.querySelector(`date-picker[data-type="to"]`);
                let zone = this.querySelector(`custom-select[data-arr="zones"]`);
                let fromTime = elemFrom.dataset.val;
                let toTime = elemTo.dataset.val;
                let offset = zone.dataset.val * 1000 * 60 * 60;
                fromTime = +fromTime + offset;
                toTime = +toTime + offset;

                // console.log(new Date(+fromTime));
                this.dataset.from = fromTime;
                this.dataset.to = toTime;
                this.sendEvent(fromTime, toTime);
                this.opened = false;
		    }
	    }
    }


}
customElements.define("date-range", DateRange);

class CustomSelect extends HTMLElement {

    constructor(){
        super();

    }
    connectedCallback() {
        const dataName = this.dataset.arr;
        const rootItem = document.createElement("DIV");
        rootItem.innerText = data[dataName][0].name;



        rootItem.classList.add("select-selected");
        this.appendChild(rootItem);
        let list = document.createElement("DIV");
        list.classList.add("select-items");
        list.classList.add("select-hide");
        for (let i = 0; i < data[dataName].length; i++){
            let item = document.createElement("DIV");
            item.innerHTML = data[dataName][i].name;
            item.dataset.val = data[dataName][i].id;
            list.appendChild(item);
        }
        list.addEventListener("click", function (e) {
            rootItem.innerText = e.target.innerText;
            let items = this.getElementsByTagName("div");
            for (let i = 0; i < items.length; i++) {
                items[i].removeAttribute("class");
            }
            e.target.classList.add("same-as-selected");
            let event = new CustomEvent("change", {
                "detail": {
                    "id": e.target.dataset.val,
                    "name": e.target.innerText,
                    "type": dataName
                },
                bubbles: true
            });
            this.parentElement.dataset.val = e.target.dataset.val;

            this.dispatchEvent(event);

        });
        this.appendChild(list);
        // console.log(rootItem);
        list.style.width = (rootItem.getBoundingClientRect().width || 478) + "px";

        rootItem.addEventListener("click", function(e) {
            e.stopPropagation();
            if (document.onclick){
                document.onclick(this);
            }
            document.onclick = closeAllSelect;

            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-elem");
        });

        if (dataName === "zones") {
            let currentOffset  = new Date().getTimezoneOffset() / -60;
            let currentData;
            currentData = data[dataName].find(item => item.id === currentOffset);
            rootItem.innerText = currentData.name;
            this.dataset.val = currentData.id;
            let items = [...list.getElementsByTagName("div")];
            let currentElem;
            currentElem = items.find(item => {
                
                return item.dataset.val == currentOffset;
            });
            currentElem.classList.add("same-as-selected")
        }

        function closeAllSelect(elem) {
            let x, y, arrNo = [];
            x = document.getElementsByClassName("select-items");
            y = document.getElementsByClassName("select-selected");
            for (let i = 0; i < y.length; i++) {
                if (elem == y[i]) {
                    arrNo.push(i)
                } else {
                    y[i].classList.remove("select-elem");
                }
            }
            for (let i = 0; i < x.length; i++) {
                if (arrNo.indexOf(i)) {
                    x[i].classList.add("select-hide");
                }
            }
        }
    }
}
customElements.define("custom-select", CustomSelect);


class DatePicker extends HTMLElement {
	static get observedAttributes() {
		return [
			"data-val",
		]
	}
    constructor(){
        super();
        this.date = new Date();


    }
    connectedCallback() {
        this.innerHTML = `
                    <div class="currentElem"></div>
                    <div class="date-wrapper date-hide">
                        <div class="arrow prev"> < </div>
                        <div class="arrow next"> > </div>
                        <div class="date-title"></div>
                        <div class="days-name-wrap">
                            <div>SU</div>
                            <div>MO</div>
                            <div>TU</div>
                            <div>WE</div>
                            <div>TH</div>
                            <div>FR</div>
                            <div>SA</div>
                        </div>
                        <div class="days-wrapper">
                        </div>
                    </div>`;


        this.init();
    }

    renderMonthData (date) {
        let arr = [];
        let y = date.getFullYear();
        let m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);
        let lastDayPrevMonth = new Date(y, m, 0);
        for (let i = firstDay.getDay(), j = 1; j <= lastDay.getDate(); i++, j++){
            arr[i] = {
                active: true,
                val: j
            }
        }
        for (let i = lastDay.getDate() + firstDay.getDay(), j = 1; i < 42; i++, j ++){
            arr[i] = {
                active: false,
                val: j
            }
        }
        for (let i = firstDay.getDay() - 1, j = lastDayPrevMonth.getDate(); i >= 0; i--, j--){
            arr[i] = {
                active: false,
                val: j
            }
        }
        return arr;
    }
    prevMonth (date){
        let y = date.getFullYear();
        let m = date.getMonth();
        // lastDayPrevMonth
        return new Date(y, m, 0);
    }
    nextMonth (date) {
        let y = date.getFullYear();
        let m = date.getMonth();
        // firstDayNextMonth
        return new Date(y, m + 1, 1);
    }
    drawDays(date = new Date()){
        let data = this.renderMonthData(date);
        let wrap = this.getElementsByClassName("days-wrapper")[0];
        wrap.innerHTML = "";
        this.drawTitle(date);
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < data.length; i++){
            let div = document.createElement("div");
            div.innerText = data[i].val;
            if (data[i].active){
                div.classList.add("active");
            }
            fragment.appendChild(div);
        }
        wrap.appendChild(fragment);
    }
    drawTitle (date) {
        let title = this.getElementsByClassName("date-title")[0];
        title.innerText = `${getMonthName(date)} - ${date.getFullYear()}`
    }
    drawCurrentTitle (day) {
        let currentElem = this.querySelector(".currentElem");
        currentElem.innerText = `${getMonthName(this.date)} ${day}, ${this.date.getFullYear().toString().slice(-2)}`
    }
    closeAllSelect(elem) {
        let x, y, arrNo = [];
        x = document.getElementsByClassName("date-wrapper");
        y = document.getElementsByClassName("currentElem");
        for (let i = 0; i < y.length; i++) {
            if (elem == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-elem");
            }
        }
        for (let i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("date-hide");
            }
        }
    }
    sendEvent(){
	    let event = new CustomEvent("change", {
		    "detail": {
			    "day": this.date.getDate(),
			    "date": this.date,
			    "type": this.type
		    },
		    bubbles: true
	    });
	    this.dataset.val = this.date.valueOf();
	    this.dispatchEvent(event);
    }
    init () {
	    this.type = this.dataset.type;
        this.drawDays(this.date);
        this.drawCurrentTitle(this.date.getDate());
        this.querySelector(".prev").addEventListener("click", e => {
            this.date = this.prevMonth(this.date);
            this.drawDays(this.date);
            e.stopPropagation();
        });
        this.querySelector(".next").addEventListener("click", e => {
            this.date = this.nextMonth(this.date);
            this.drawDays(this.date);
            e.stopPropagation();
        });
        this.querySelector(".currentElem").addEventListener("click", e => {
            if (document.onclick){
                document.onclick(this);
            }
            document.onclick = this.closeAllSelect;
            e.target.classList.toggle("select-elem");
            e.target.nextElementSibling.classList.toggle("date-hide");
            e.stopPropagation();

        });
        this.querySelector(".days-wrapper").addEventListener("click", e => {
            e.stopPropagation();
            if (!e.target.classList.contains("active")) {
                return;
            }

            [...this.querySelectorAll(".days-wrapper div")].forEach(el => {
                el.classList.remove("selected");
            });
            e.target.classList.add("selected");
            this.drawCurrentTitle(e.target.innerText);
	        this.date.setDate(e.target.innerText);
	        this.sendEvent();
            this.closeAllSelect();

        });
	    this.sendEvent();
    }
	attributeChangedCallback(attrName, oldVal, newVal) {
		switch (attrName) {
			case "data-val":
			    let newDate = new Date(+this.dataset.val);
				if (this.date.getMonth() !== newDate.getMonth()){
					this.date = new Date(+this.dataset.val);
					this.drawDays(this.date);
				}
				else {
					this.date = new Date(+this.dataset.val);
                }
				this.drawCurrentTitle(this.date.getDate());
				break;
		}
	}

}
customElements.define("date-picker", DatePicker);

function getShornMonthName(date) {
	const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return  data[date.getMonth()];
}
function getMonthName(date) {
	const data = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return data[date.getMonth()];
}