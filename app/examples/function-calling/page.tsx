"use client";

import styles from "../shared/page.module.css";
import Chat from "../../components/chat";
import { getPrograms } from "../../utils/program";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useState, useRef } from "react";
import { useRouter } from 'next/router';
import SearchBar from '../../components/search/searchbar';
import Popup from '../../components/search/popup'
import { Customer } from "@/types/customer";

const FunctionCalling = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const chatRef = useRef(null);

    const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
      if (call?.function?.name === "getPrograms") {
        const args = JSON.parse(call.function.arguments);
        const data = getPrograms(args.department, args.ageSpec, args.gender, args.days, args.locations, args.timeRange, args.names);
        return JSON.stringify(data);
      }
    };
    const closePopup = () => setIsPopupOpen(false);
    const openPopup = () => setIsPopupOpen(true);

    const onSelectCustomer = (customer: Customer) => {
      if (chatRef.current) {
        const customerInfo = `Selected customer: ${customer.full_name} (ID: ${customer.id})`;
        chatRef.current.appendMessage("assistant", customerInfo);
      }
    };
  
    return (
      <main className={styles.main}>
        <div className={styles.container}>
        <nav className={styles.navbar}>
        <img
          src="/fastbreak.png"
          alt="Fastbreak Logo"
          width={100}
          height={40}
        />
        <SearchBar onClick={openPopup}/>
        <Popup isOpen={isPopupOpen} onClose={closePopup} onSelectCustomer={onSelectCustomer}/> 
        </nav>
          <div className={styles.chatContainer}>
            <div className={styles.chat}>
              <Chat ref={chatRef} functionCallHandler={functionCallHandler} />
            </div>
          </div>
        </div>
      </main>
    );
  };
export default FunctionCalling;
