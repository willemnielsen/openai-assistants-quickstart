"use client";

import styles from "../shared/page.module.css";
import Chat from "../../components/chat";
import { getPrograms } from "../../utils/program";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useState } from "react";
import { useRouter } from 'next/router';
import SearchBar from './searchbar';
import Popup from './popup'





const FunctionCalling = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
      if (call?.function?.name === "getPrograms") {
        const args = JSON.parse(call.function.arguments);
        const data = getPrograms(args.department, args.ageSpec, args.gender, args.days, args.locations, args.timeRange, args.names);
        return JSON.stringify(data);
      }
    };
    const closePopup = () => setIsPopupOpen(false);
    const openPopup = () => setIsPopupOpen(true);
  
    
    return (
      <main className={styles.main}>
        <div className={styles.container}>
        <nav className={styles.navbar}>
        <SearchBar placeholder="Find customer" onClick={openPopup}/>
        <Popup isOpen={isPopupOpen} onClose={closePopup}></Popup>
        </nav>
          <div className={styles.chatContainer}>
            <div className={styles.chat}>
              <Chat functionCallHandler={functionCallHandler} />
            </div>
          </div>
        </div>
      </main>
    );
  };
export default FunctionCalling;
