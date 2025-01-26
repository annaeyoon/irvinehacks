document.getElementById('chat-input').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
})

const chats = document.getElementById("chats");

const createMessage = (message, dir) => {
    // dir = "left"  is the user
    // dir = "right" is the AI
    // message is a string
    const messageOuter = document.createElement("div");
    messageOuter.setAttribute("class", "message-left");
    const messageInner = document.createElement("div");
    messageInner.setAttribute("class", "message-bubble-left");
    if (dir == "left") {
        messageOuter.setAttribute("class", "message-left");
        messageInner.setAttribute("class", "message-bubble-left");
    } else if (dir == "right") {
        messageOuter.setAttribute("class", "message-right");
        messageInner.setAttribute("class", "message-bubble-right");
    }
    messageOuter.appendChild(messageInner);
    const messageContent = document.createElement("p");
    messageContent.innerHTML = message;
    messageInner.appendChild(messageContent);
    messageContent.innerHTML = message;
    chats.appendChild(messageOuter);
    chats.scrollTo(0, chats.scrollHeight);
    return messageOuter;
}

function sendMessage() {
    var textarea = document.getElementById("chat-input");
    var content = textarea.value;
    // check for empty
    if (content.trim() == "") {
        console.log("Empty!");
    } else {
        createMessage(content, "right");
    }
    textarea.value = "";
    textarea.focus();
}

function goBackToMain() {
    window.location.href = 'index.html';
}