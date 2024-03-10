const input_text = document.querySelector('#chat-input');
const send_button = document.querySelector('#send-btn');
const chat_container = document.querySelector('.chat-container');
const theme_button = document.querySelector('#theme-btn');
const scroll_button = document.querySelector('#scroll-btn');
const delete_button = document.querySelector('#delete-btn');
const regenerateBtn = document.querySelector('#regenerate-btn');

let userText = null;

const API_KEY = "YOUR TOKEN HERE";

const loadFromStorage = () => {
    const theme = localStorage.getItem("theme");
    if(theme == "dark_mode") {
        document.body.classList.add("lightmode");
    }
    else {
        document.body.classList.remove("darkmode");
    }

    const begin_text = `
    <div class="begin-text">
        <h1>AI BOT CLONE</h1>
        <br>
        <p>Start your conversation with the ChatGPT Clone!</p>
    </div>`;
    

    chat_container.innerHTML = localStorage.getItem("chats") || begin_text;

}

loadFromStorage();

const getResponseAI = async (incomingMessage) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");


    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0,
        })
    }
    /*gpt-3.5-turbo-instruct */
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim(); 
    } catch (err) {
        pElement.classList.add("error");
        pElement.textContent = "Something went wrong please try again.";
    }

    incomingMessage.querySelector(".typing-animation").remove(); 
    incomingMessage.querySelector(".chat-details").appendChild(pElement); 
    localStorage.setItem("chats", chat_container.innerHTML); //save chat content to local storage
}

const responseCopy = (cpybtn) => {
    const responseParent = cpybtn.parentNode;
    const responseElemText = responseParent.querySelector("p").textContent;
    navigator.clipboard.writeText(responseElemText);
    cpybtn.textContent = "done";
    setTimeout(()  => cpybtn.textContent = "content_copy", 800);
}

const typingAnimation = () => {
    const chatContentHTML = `
    <div class="chat-content">
    <div class="chat-details">
        <img src="images/chatbot.png" alt="chatbot">
        <div class="typing-animation"> 
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    </div>
    <span onClick="responseCopy(this)" class="material-symbols-rounded">content_copy</span> 
</div>`;

    //chreate outgoing chat div and append to chat container, which is the wrapper element
    const incomingMessage = createElement(chatContentHTML, "incoming");
    chat_container.appendChild(incomingMessage);
    getResponseAI(incomingMessage);
}

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
    if(!userText) return;
    const chatContentHTML = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/user.png" alt="user">
            <p></p>
        </div>
    </div>`;


    // Reset the height of the input textarea to its initial value
    input_text.style.height = "initial";

    //chreate outgoing chat div and append to chat container, which is the wrapper element
    const outgoingMessage = createElement(chatContentHTML, "outgoing");
    outgoingMessage.querySelector("p").textContent = userText; 
    //remove begin text
    document.querySelector(".begin-text")?.remove();
    chat_container.appendChild(outgoingMessage);

    input_text.value = '';

    setTimeout(typingAnimation, 200);

}

const changeTheme = () => {
    document.body.classList.toggle("lightmode");
    if (document.body.classList.contains("lightmode")) {
        theme_button.innerText = "dark_mode";
    }
    else {
        theme_button.innerText = "light_mode"
    }
    localStorage.setItem("theme", theme_button.innerText);
}

send_button.addEventListener('click', chatInterpreter);

input_text.addEventListener('keydown', (event) => {
    // Check if the pressed key is Enter (key code 13) and Shift key is not pressed
    if (event.keyCode === 13 && !event.shiftKey) {
        // Prevent the default action of the Enter key (form submission)
        event.preventDefault();
        // Call the chatInterpreter function
        chatInterpreter();
    }
});

const scrollDown = () => {
    chat_container.scrollTo(0, chat_container.scrollHeight);
}

const deleteChat = () => {
    const delete_bool = confirm("Are you sure you want to delete all chats");
    if(delete_bool) {
        localStorage.removeItem("chats");
        loadFromStorage();
    }

}

const regenerateResponse = () => {
    const lastIncomingMessage = document.querySelector('.chat.incoming:last-child');
    if (lastIncomingMessage) {
        lastIncomingMessage.remove(); // Remove the last incoming message
        typingAnimation(); // Regenerate the response for the last user input
    }
}

theme_button.addEventListener('click', changeTheme);
scroll_button.addEventListener('click', scrollDown);
delete_button.addEventListener('click', deleteChat);
regenerateBtn.addEventListener('click', regenerateResponse);

input_text.addEventListener("input", () => {
input_text.style.height = `${input_text.scrollHeight}px`;
});

input_text.addEventListener("input", () => {
    if (input_text.value.trim() === "") {
        input_text.style.height = "initial";
    }
}); 