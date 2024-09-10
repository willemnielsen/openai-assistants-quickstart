"use client";

import styles from "../shared/page.module.css";
import Chat from "../../components/chat";
import { getPrograms } from "../../utils/program";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useState } from "react";


  const FunctionCalling = () => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };

    const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
      if (call?.function?.name === "getPrograms") {
        const args = JSON.parse(call.function.arguments);
        const data = getPrograms(args.department, args.ageSpec, args.gender, args.days, args.locations, args.timeRange, args.names);
        return JSON.stringify(data);
      }
    };

    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.searchBar}>
            <label htmlFor="search">Active Customer:</label>
            <input type="text" id="search" value={searchValue} onChange={handleSearchChange} />
          </div>
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
