
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../App.css';

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const Appp = () => {
  const API_KEY = import.meta.env.VITE_KEY;
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Loan Manager! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSendRequest = async (message) => {
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

    const SuggestKeywords = ["loan suggestion", "suggestion", "best", "better", "solution", "best idea", "best bank", "match"];

    const shouldPromptSuggestion = chatMessages.some((messageObject) =>
      SuggestKeywords.some(keyword => messageObject.message.toLowerCase().includes(keyword))
    );

    let matchsug = "";
    if (shouldPromptSuggestion) {
      matchsug = "give only one best solution and explain based on those data:--- sonali bank: Loan Limit: BDT 50,000/-(Fifty thousand) to BDT 500,000,00/-(Five crore) 2) Criteria of Borrower: Bangladeshi Citizen minimum 18 (eighteen) years old; Loan defaulter, Bank-rupt, Mentally wreaked person cannot apply for loan; Women Entrepreneurs highly encourage to apply. 3) Nature of Project/Enterprise: Proprietorship Enterprise; Registered Partnership Enterprise; Private Limited Company; Joint Venture Company except Public Limited Company. 4) Security: The collateral security free loan limit for male entrepreneurs is upto Tk. 5 lac. The collateral security free loan limit for women entrepreneurs is upto Tk. 10 lac. 5) Period: Project/Term Loan: Maximum 5 years (project period may flexible according to Project nature) Working capital/Trading Loan : 1 year, renewable at the end of period. 6) Loan: Equity Ratio: Project/Term Loan: 70:30 Working capital/Trading Loan : 75:25 7) Repayment procedure: Project/Term Loan: monthly/quarterly basis repayable within loan period. ---Dhaka Bank: Loan Range: BDT 150,000/-(One hundred fifty thousand) to BDT 1,500,000,00/-(One hundred fifty crore) Eligibility Criteria: Bangladeshi Citizens aged minimum 23 years. Applicants with a clean financial background and a viable business plan are preferred. Special consideration is given to women entrepreneurs. Permissible Business Structures: Sole Proprietorship; Registered Partnership; Private Limited Company; Joint Venture (excluding Public Limited Company). Security: Collateral-free loans up to Tk. 12 lac for male entrepreneurs and up to Tk. 18 lac for female entrepreneurs. Loan Tenure: Project/Term Loan: Maximum 6 years (flexible based on project nature); Working capital/Trading Loan: 18 months, renewable. Financing Ratio: Project/Term Loan: 55:45; Working capital/Trading Loan: 65:35. Repayment Method: Project/Term Loan: Monthly/quarterly repayments within the loan tenure.--- Prime Bank: Loan Range: BDT 100,000/-(One hundred thousand) to BDT 1,000,000,00/-(One hundred crore) Eligibility Criteria: Bangladeshi Citizens aged minimum 21 years. Applicants with a clean financial record and sound mental health are preferred. Special support is extended to women entrepreneurs. Acceptable Business Structures: Sole Proprietorship; Registered Partnership; Private Limited Company; Joint Venture (excluding Public Limited Company). Security: Male entrepreneurs can access collateral-free loans up to Tk. 10 lac, while female entrepreneurs can avail up to Tk. 15 lac without collateral. Loan Tenure: Project/Term Loan: Maximum 7 years (flexible based on project nature); Working capital/Trading Loan: 2 years, renewable. Financing Ratio: Project/Term Loan: 60:40; Working capital/Trading Loan: 70:30. Repayment Methodology: Project/Term Loan: Monthly/quarterly repayments within the loan tenure.--- Islami Bank: Financing Range: BDT 200,000/-(Two hundred thousand) to BDT 2,000,000,00/-(Two hundred crore) Applicant Criteria: Bangladeshi Citizens aged minimum 25 years. Applicants with a proven track record in business and adherence to Islamic principles are given priority. Female entrepreneurs are strongly encouraged. Acceptable Business Models: Sole Proprietorship; Registered Partnership; Private Limited Company; Joint Venture (excluding Public Limited Company). Collateral: Male entrepreneurs can obtain collateral-free financing up to Tk. 15 lac, while female entrepreneurs can access up to Tk. 20 lac without collateral. Financing Duration: Project/Term Financing: Maximum 8 years (flexible based on project nature); Working capital/Trading Financing: 2 years, renewable. Financing Structure: Project/Term Financing: 65:35; Working capital/Trading Financing: 70:30. Repayment Plan: Project/Term Financing: Monthly/quarterly repayments within the financing tenure.";
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a loan manager! Choose your option: Home, transport, or bank." },
        ...apiMessages.filter(message => isLoanRelated(message.content)),
        { role: "user", content: matchsug },
      ],
    };

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

  function isLoanRelated(message) {
    const loanKeywords = ["loan", "home", "mortgage", "property", "finance", "credit", "housing", "lending"];
    const loanRegex = /\b(loan|home|mortgage|property|finance|credit|housing|lending)\b/i;
    return loanKeywords.some(keyword => message.toLowerCase().includes(keyword)) || loanRegex.test(message);
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "500px", width: "700px" }}>
        <h1>Loan manager</h1>
        <MainContainer>
          <ChatContainer style={{padding:"10px"}}>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput
              placeholder="Send a Message"
              onSend={(value) => handleSendRequest(value)} // Modified to extract the message
            />    
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default Appp;
