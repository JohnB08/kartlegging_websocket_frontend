const userNameLocation = document.querySelector("#username");
const rerollBtn = document.querySelector("#rerollUserName");
const chatArea = document.querySelector("#output");
const messageinput = document.querySelector("#typingInput");
const sendBtn = document.querySelector("#sendMessage");
const duckContainer = document.querySelector(".duckContainer");

const apiUri = "https://unsafewebsockettest-a6dth4bxbmdshfdg.norwayeast-01.azurewebsites.net/"
const apiUrl = new URL(apiUri);

let generatedName = await getName();

userNameLocation.textContent = generatedName;

async function getName(name = null)
{
    const response = await fetch(apiUrl + "name" + (name === null ? "" : `/${name}`));
    return await response.text();
}

const webSocket = new WebSocket(apiUrl + generatedName);

rerollBtn.addEventListener("click", async()=>{
    let oldGeneratedName = generatedName;
    generatedName = await getName(oldGeneratedName);
    userNameLocation.textContent = generatedName;
})

sendBtn.addEventListener("click", sendMessage)

window.addEventListener("keydown", (e)=>{
    if (e.key === "Enter") {
        duckContainer.classList.remove("duckContainer");
        duckContainer.classList.add("duckContainerActive");
        sendMessage();
        setTimeout(500);
        duckContainer.classList.remove("duckContainerActive");
        duckContainer.classList.add("duckContainer");
    }
})

const writeToOuput = (message) => {
    chatArea.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
}

const sendOnSocket = (message) => {
    writeToOuput(`SENT: ${message}`);
    webSocket.send(message);
}

webSocket.onopen = (e) =>
    {
        writeToOuput("CONNECTED!");
        sendOnSocket(`${generatedName} has connected!`);
    } 

    webSocket.onmessage = (e) =>
    {
        writeToOuput(`${e.data}`)
    }
webSocket.onclose = (e) =>{
    writeToOuput("DISCONNECTED!");
} 
function sendMessage(){
    const text = messageinput.value;
    text && sendOnSocket(generatedName + ": " + text);
    messageinput.value = "";
    messageinput.focus();
}