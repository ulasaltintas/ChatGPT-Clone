const input_text = document.querySelector('#chat-input');
const send_button = document.querySelector('#send-btn');
const chat_container = document.querySelector('.chat-container');

let userText = null;

const createElement = (chatContentHTML, class_name) => {
    // Create new div, apply chat, class and set html context
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", class_name);
    chatDiv.innerHTML = chatContentHTML;
    //return created chat div
    return chatDiv;
}

const chatInterpreter = () => {
    userText = input_text.value.trim();
    const chatContentHTML = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/user.png" alt="user">
            <p>${userText}</p>
        </div>
    </div>`;

    //chreate outgoing chat div and append to chat container, which is the wrapper element
    const outgoingMessage = createElement(chatContentHTML, "outgoing");
    chat_container.appendChild(outgoingMessage);

}

send_button.addEventListener('click', chatInterpreter);