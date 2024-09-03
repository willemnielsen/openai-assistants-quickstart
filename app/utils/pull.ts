import { openai } from "@/app/openai";
// const mysql = require('mysql')
const pullData = (table_name: string, new_table_name: string, filters: string) => {
  // chose a random temperature and condition
  const tool_instruction = `
  Your job is to convert the filters prompt into the WHERE clause in a SQL SELECT
  query. Here are some examples.
  1. 
  Input: 'Older than 12'
  Output: TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) > 12 

  2. 
  Input: 'Name is Jesse Edelson'
  Output: full_name = 'Jesse Edelson'
  ` 
  console.log("Now telling SQL GPT to write query")
  const where_clause = openai.chat.completions.create(
    {
      model: "gpt-4o-mini",
      messages: [{role: "system", content: tool_instruction},{role: "user",content: filters}]
    }
  )
  console.log("Received query from SQL GPT, now connecting to database")
  const query = `DROP TABLE IF EXISTS ${new_table_name};
  CREATE TABLE ${new_table_name} AS SELECT * FROM ${table_name}
  WHERE ${where_clause};
  SELECT * FROM ${new_table_name} LIMIT 5`
  // var mysql  = require('mysql');
  // var connection = mysql.createConnection({
  //   user     : 'root',
  //   password : 'Nola@1125',
  //   database : 'dash'
  // });
  // connection.connect();
  // console.log("Connected to database, now running query")
  // const result = connection.query(query, function (error, results, fields) {
  //   if (error) throw error;  
  //   return {
  //     "query": query,
  //     "results": results
  //   };
  // });
  console.log("Query was successful, returning result")
  return 
};

export { pullData };
