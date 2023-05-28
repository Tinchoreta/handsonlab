let socket = io();
let userName;

let chatBox = document.getElementById("chatBox");
chatBox.addEventListener("keyup", handleSendMessage);

let btnSend = document.getElementById("btnSend");
btnSend.addEventListener("click", handleSendMessage);

Swal.fire({
    title: "Write your name :)",
    input: "text",
    inputValidator: (value) => !value && "please write your name",
    allowOutsideClick: false,
    icon: "success",
    background: "#767e87",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#B5DC86"
}).then((res) => {
    userName = res.value;
    document.getElementById("username").innerHTML = "Conectado como: " + userName;
    socket.emit("auth", userName);
    chatBox.focus();
});


function handleSendMessage(e) {
    if (e.key === "Enter" || e.type === "click") {
        // e.preventDefautl();
        let message = chatBox.value;
        if (message.trim()) {
            socket.emit("newMessage", {
                userName: userName,
                message: message
            });
            chatBox.value = "";
            scrollToBottom();
        }
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on("allMessages", (message) => {
    document.getElementById("chatMessages").innerHTML = message
        .map((msg) => `<br><b>${msg.userName}</b>: ${msg.message}`)
        .join("");
    scrollToBottom();
});


// socket.on("newMessage", (message) => {
//     document.getElementById("chatMessages").innerHTML += `<br><b>${message.userName}:</b> ${message.message}`;
// });


    // // crea un nuevo elemento div para contener el mensaje y el nombre de usuario
    // const chatMessage = document.createElement("div");
    // chatMessage.classList.add("d-flex", "flex-row", "p-3");

    // // crea una imagen de usuario y la agrega al mensaje
    // const userImage = document.createElement("img");
    // userImage.src = "https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png";
    // userImage.width = 30;
    // userImage.height = 30;
    // chatMessage.appendChild(userImage);

    // // crea un nuevo elemento div para el mensaje y lo agrega al mensaje
    // const messageDiv = document.createElement("div");
    // messageDiv.classList.add("ml-2", "p-3", "messages");
    // messageDiv.innerHTML = `
    //     <div class="d-flex flex-row p-3">
    //         <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30"
    //             height="30">
    //         <div class="chat ml-2 p-3">
    //             <b>${message.userName}:</b> ${message.message}
    //         </div>
    //     </div>
    // `;
    // chatMessage.appendChild(messageDiv);

    // // Agrega el mensaje al contenedor de chatMessages
    // const chatMessages = document.getElementById("chatMessages");
    // chatMessages.appendChild(chatMessage);
    // console.log(chatMessages.innerHTML + " " + chatMessages);
    // // Mueve el foco al cuadro de chat para que el usuario pueda escribir un mensaje nuevo
    // chatBox.focus();