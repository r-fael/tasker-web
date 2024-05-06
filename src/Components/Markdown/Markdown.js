import { Box } from "@chakra-ui/react";
import React from "react";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.scss";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Markdown = ({ onclick, content }) => {
  return (
    <Box onClick={onclick} className={styles.reactMarkdownContainer}>
      <ReactMarkdown
        className={styles.reactMarkdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default Markdown;
