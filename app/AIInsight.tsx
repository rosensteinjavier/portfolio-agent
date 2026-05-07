// app/components/AIInsight.tsx
'use client';

import React from 'react';

interface AIInsightProps {
  explanation: string;
  loading?: boolean;
}

const AIInsight: React.FC<AIInsightProps> = ({ explanation, loading }) => {
  const formatTextWithBreaks = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#111",
          padding: 20,
          borderRadius: 10,
          border: "1px solid #333",
          marginTop: 10,
        }}
      >
        <p style={{ color: "#888" }}>Loading AI insights...</p>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 10,
        border: "1px solid #333",
        marginTop: 10,
      }}
    >
      <div style={{
        color: "#fff",
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap' // This also helps with line breaks
      }}>
        {formatTextWithBreaks(explanation)}
      </div>
    </div>
  );
};

export default AIInsight;