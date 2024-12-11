(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Join Chatroom
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Send Message with Click
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        sendMessage();
    });

    // Send Message with Enter Key
    app.querySelector(".chat-screen #message-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents newline in input
            sendMessage();
        }
    });

    // Exit Chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    // Listen for Updates
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    // Listen for Incoming Messages
    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    // Function to Send Message
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = ""; // Clear the input
    }

    // Function to Render Message
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type === "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div> 
            </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div> 
            </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // Scroll to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
