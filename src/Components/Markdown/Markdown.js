import { Box } from "@chakra-ui/react";
import React from "react";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.scss";
import ReactMarkdown from "react-markdown";

const Markdown = ({ onclick, content }) => {
  return (
    <Box onClick={onclick} className={styles.reactMarkdownContainer}>
      <ReactMarkdown
        redenre={{ code: Highlight }}
        className={styles.reactMarkdown}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default Markdown;
