import { useState, useEffect } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

const useEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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
    }
  };

  return { editorState, setEditorState, handleSave };
};


export default useEditor;