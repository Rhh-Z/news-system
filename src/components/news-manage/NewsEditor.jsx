import { ContentState, convertToRaw, EditorState } from 'draft-js'
import React from 'react'
import { useState } from 'react'
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html'
import { useEffect } from 'react'
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {


  // 将content传入富文本
  useEffect(() => {
    const html = props.content
    if (html == undefined) return
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [props.content])

  const [editorState, setEditorState] = useState('')

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={(editorState) => setEditorState(editorState)}
      onBlur={() => {
        // 子传父
        props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      }}
    />
  )
}
