import { useState, useEffect, useRef } from "react";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";

const useEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    handleLoad();
  }, []);

  const handleSave = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const contentAsJSON = JSON.stringify(rawContentState);

    localStorage.setItem("draftEditorContent", contentAsJSON);
    alert("Content saved successfully!");
  };

  const handleLoad = () => {
    const savedContent = localStorage.getItem("draftEditorContent");
    const parsedContent = savedContent ? JSON.parse(savedContent) : null;

    if (parsedContent) {
      const newEditorState = EditorState.createWithContent(
        convertFromRaw(parsedContent)
      );
      setEditorState(newEditorState);
    } else {
        editorRef.current?.focus();
    }
  };

  return { editorState, setEditorState, handleSave, editorRef };
};


export default useEditor;