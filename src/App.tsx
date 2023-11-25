import Button from "./components/Button"
import {Editor, EditorState, RichUtils, ContentState, Modifier, ContentBlock, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import useEditor from './hooks/editor';

const styleMap = {
  'COLOR-RED': {
    color: 'red',
  },
};

function App() {
  const { editorState, setEditorState, handleSave, editorRef } = useEditor()

  const getNewEditorState = (currentEditorState: EditorState, contentState:ContentState, selection: SelectionState, startOffset: number, replaceText = ' ') => {
    const newContentState = Modifier.replaceText(contentState, selection.merge({
      anchorOffset: 0,
      focusOffset: startOffset
    }), replaceText);

    return EditorState.push(currentEditorState, newContentState, 'remove-range');
  }

  const handleBeforeInput = (chars: string, currentState: EditorState) => {
    const contentState = currentState.getCurrentContent();
      const selection = currentState.getSelection();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const block = contentState.getBlockForKey(startKey);
      const text = block.getText().slice(0, startOffset);


      if (text.startsWith('#') && chars === ' ') {
        const newEditorState = getNewEditorState(currentState, contentState, selection, startOffset, '')
        setEditorState(RichUtils.toggleBlockType(newEditorState, 'header-one'));
        return 'handled';
      }

      if (text.startsWith('```') && chars === ' ') {
        const newEditorState = getNewEditorState(currentState, contentState, selection, startOffset)
        setEditorState(RichUtils.toggleBlockType(newEditorState, 'code-block'));
        return 'handled';
      }

      if (text.startsWith('***') && chars === ' ') {
        const newEditorState = getNewEditorState(currentState, contentState, selection, startOffset)
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE'));
        return 'handled';
      }

      if (text.startsWith('**') && chars === ' ') {
        const newEditorState = getNewEditorState(currentState, contentState, selection, startOffset)
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'COLOR-RED'));
        return 'handled';
      }


      if (text.startsWith('*') && chars === ' ') {
        const newEditorState = getNewEditorState(currentState, contentState, selection, startOffset)
        setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
        return 'handled';
      }

    return 'not-handled'; 
  };


  const handleReturn = (_: React.KeyboardEvent, currentEditorState: EditorState) => {
    const contentState = currentEditorState.getCurrentContent();
    const selection = currentEditorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
    const currentStyle = currentEditorState.getCurrentInlineStyle();

    if (blockType !== 'unstyled' || !currentStyle.isEmpty()) {
      const splitContent = Modifier.splitBlock(contentState, selection);
      let newEditorState = EditorState.push(
        currentEditorState,
        splitContent,
        'split-block'
      );
    
      // Remove all current inline styles
      currentStyle.forEach((style) => {
        if (style) newEditorState = RichUtils.toggleInlineStyle(newEditorState, style)
      })

      setEditorState(RichUtils.toggleBlockType(newEditorState, 'unstyled'));
      return 'handled';
    }

    return 'not-handled';
  };


  function myBlockStyleFn(contentBlock: ContentBlock) {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return 'highlighted-code-block';
    }
    return '';
  }

  return (
    <div className="w-full h-full p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex flex-row items-center justify-center gap-4">
        <p className="flex-1 text-lg font-semibold text-center">Title</p>
        <Button onClick={handleSave}>Save</Button>
      </div>
      <Editor
        ref={editorRef}
        customStyleMap={styleMap}
        editorState={editorState}
        blockStyleFn={myBlockStyleFn}
        onChange={(editorState) => setEditorState(editorState)}
        handleBeforeInput={handleBeforeInput}
        handleReturn={handleReturn}
      />
      {/* <CustomEditor /> */}
    </div>
  )
}

export default App
