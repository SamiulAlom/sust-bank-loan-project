import { useState, useEffect }  from 'react';
import './App.css';
import  "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY =import.meta.env.VITE_KEY
// const save=[];
const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Loan Manager! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
 

  const handleSendRequest = async (message) => {
    // save.push(message+'')
    // console.log(save);
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };
   
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);
  
   
    
    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };
  



  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });
    
   
  let matchsug = "";
  
async function fetchLoanDataFromAPI() {
  try {
    const response = await fetch('https://apurba3036.github.io/apitest/loan.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }
}


async function updateMatchsugFromAPI() {
  const loanData = await fetchLoanDataFromAPI();
  if (loanData) {
    matchsug = JSON.stringify(loanData); 
    return matchsug;
  }
  return null;
}


matchsug = await updateMatchsugFromAPI();


    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a loan manager! Choose your option: Home, transport, or bank." },
        ...apiMessages.filter(message => isLoanRelated(message.content)),
        { role: "user", content: matchsug },
      ],
    };
    
 
  function isLoanRelated(message) {
    const loanKeywords = ["loan", "home", "mortgage", "property", "finance", "credit", "housing", "lending"];
    const loanRegex = /\b(loan|home|mortgage|property|finance|credit|housing|lending)\b/i;
    return loanKeywords.some(keyword => message.toLowerCase().includes(keyword)) || loanRegex.test(message);
  }
  
    

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <div className="App app">
      
      <div style={{ position:"relative", height: "500px", width: "700px"  }}>
       <h1>Loan manager</h1>
        <MainContainer className='mb-5'>
          <ChatContainer style={{padding:"10px"}}>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
               
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App;