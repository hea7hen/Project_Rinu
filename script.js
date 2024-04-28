const noButton = document.getElementById("no-btn");
const yesButton = document.getElementById("yes-btn");
const popup = document.getElementById("popup");
const no = document.getElementById("no");
let count = 0;
noButton.addEventListener("mouseover", () => {
    noButton.style.position = "absolute";
    noButton.style.left = Math.random() * 80 + "vw";
    noButton.style.top = Math.random() * 80 + "vh";
    count+=1;
    console.log("count: ",count);
    if(count==8){
        no.style.display = "block";
    }
});

yesButton.addEventListener("click", () => {
    popup.style.display = "block";
    // window.location.href = "coco.html";

    setTimeout(function() {
        window.location.href = "coco.html";
    }, 2000);
});

no.addEventListener("click", () => {
    no.style.display = "none";
});

popup.addEventListener("click", () => {
    popup.style.display = "none";
});

// Hide the popup initially
no.style.display = "none"
popup.style.display = "none";
