// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = (minify = false) => {
    if (!input.trim()) { setError('Please enter SQL'); setOutput(''); return; }
    try {
      let sql = input.trim();
      // Uppercase keywords
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'LIKE', 'BETWEEN', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AS', 'DISTINCT', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
      for (const kw of keywords) {
        const re = new RegExp(`\\b${kw}\\b`, 'gi');
        sql = sql.replace(re, kw);
      }

      if (minify) {
        sql = sql.replace(/\s+/g, ' ').trim();
      } else {
        // Add newlines before major clauses
        sql = sql.replace(/\bSELECT\b/gi, '\nSELECT');
        sql = sql.replace(/\bFROM\b/gi, '\nFROM');
        sql = sql.replace(/\bWHERE\b/gi, '\nWHERE');
        sql = sql.replace(/\bAND\b/gi, '\n  AND');
        sql = sql.replace(/\bOR\b/gi, '\n  OR');
        sql = sql.replace(/\bGROUP BY\b/gi, '\nGROUP BY');
        sql = sql.replace(/\bORDER BY\b/gi, '\nORDER BY');
        sql = sql.replace(/\bHAVING\b/gi, '\nHAVING');
        sql = sql.replace(/\bLIMIT\b/gi, '\nLIMIT');
        sql = sql.replace(/\bJOIN\b/gi, '\nJOIN');
        sql = sql.replace(/\bINNER JOIN\b/gi, '\nINNER JOIN');
        sql = sql.replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN');
        sql = sql.replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN');
        sql = sql.replace(/\bON\b/gi, 'ON');
        sql = sql.replace(/\bUNION\b/gi, '\nUNION');
        sql = sql.trim();
      }

      setOutput(sql);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Input SQL" value={input} onChange={setInput} placeholder="SELECT * FROM users WHERE age > 18" rows={6} />
      <div className="flex gap-2">
        <Button onClick={() => format(false)}>Format</Button>
        <Button variant="outline" onClick={() => format(true)}>Minify</Button>
      </div>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="Formatted SQL" value={output} rows={10} fileName="query.sql" mime="application/sql" />}
    </div>
  );
}
