import "./components";


console.log("loaded");

window.onload = () => {
	document.getElementById("btn").addEventListener("click", e => {
		let elem = document.querySelector("date-range");
		elem.opened = !elem.opened;
	});
    document.body.addEventListener("change", e => {
        console.log(e.detail);
        let fromText = document.querySelector(".from-text");
        let toText = document.querySelector(".to-text");
        fromText.innerText = e.detail.from.toLocaleString();
        toText.innerText = e.detail.to.toLocaleString();
    })
};
